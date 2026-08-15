/**
 * Classic Tick Combat Engine
 * Resolves Accuracy Rolls, Damage Rolls, Hitsplats, Loot Drops, and Death
 */

import { ITEM_DEFINITIONS } from './player.js';

export class CombatEngine {
  constructor(world) {
    this.world = world;
  }

  /**
   * Calculates maximum melee hit based on Strength level and equipment bonus.
   */
  calculateMaxHit(strLvl, strBonus = 0) {
    const effectiveStr = strLvl + 8;
    const baseDamage = 0.5 + (effectiveStr * (strBonus + 64)) / 640;
    return Math.max(1, Math.floor(baseDamage));
  }

  /**
   * Roll attack accuracy against opponent defense.
   */
  rollHit(attLvl, attBonus, defLvl, defBonus) {
    const attackRoll = (attLvl + 8) * (attBonus + 64);
    const defenseRoll = (defLvl + 8) * (defBonus + 64);

    let hitChance = 0;
    if (attackRoll > defenseRoll) {
      hitChance = 1 - (defenseRoll + 2) / (2 * (attackRoll + 1));
    } else {
      hitChance = attackRoll / (2 * (defenseRoll + 1));
    }

    return Math.random() < hitChance;
  }

  /**
   * Processes a combat round between an attacker (Player/NPC) and defender (NPC/Player).
   */
  resolveRound(attacker, defender, currentTick) {
    const isAttackerPlayer = !attacker.templateKey;
    const isDefenderPlayer = !defender.templateKey;

    // Attacker Stats & Buffs
    let attLvl = isAttackerPlayer ? (attacker.skills.hunting?.lvl || attacker.skills.attack?.lvl || 1) : attacker.combatLvl;
    let strLvl = isAttackerPlayer ? (attacker.skills.strength?.lvl || 1) : attacker.strengthBonus || attacker.combatLvl;
    let attBonus = isAttackerPlayer ? (attacker.equipment.weapon ? attacker.equipment.weapon.attackBonus || 0 : 0) : attacker.attackBonus;
    let strBonus = isAttackerPlayer ? (attacker.equipment.weapon ? attacker.equipment.weapon.strengthBonus || 0 : 0) : attacker.strengthBonus;

    if (isAttackerPlayer && attacker.activeBuffs) {
      if (attacker.activeBuffs.attack) attBonus += attacker.activeBuffs.attack.val || 0;
      if (attacker.activeBuffs.strength) strBonus += attacker.activeBuffs.strength.val || 0;
    }

    // Defender Stats
    let defLvl = isDefenderPlayer ? (defender.skills.defense?.lvl || 1) : defender.defenseBonus || defender.combatLvl;
    let defBonus = isDefenderPlayer ? (defender.equipment.body ? defender.equipment.body.defenseBonus || 0 : 0) : defender.defenseBonus;

    // Crushing Blow Passive (Strength Lvl 10) for heavy blunt/chopping weapons
    if (isAttackerPlayer && attacker.skills.strength?.lvl >= 10 && attacker.equipment.weapon) {
      const wId = attacker.equipment.weapon.id || '';
      if (wId.includes('maul') || wId.includes('greataxe') || wId.includes('sledge')) {
        defBonus = Math.floor(defBonus * 0.75); // 25% defense bypass
      }
    }

    const isHit = this.rollHit(attLvl, attBonus, defLvl, defBonus);
    let damage = 0;

    if (isHit) {
      let maxHit = isAttackerPlayer ? this.calculateMaxHit(strLvl, strBonus) : attacker.maxHit;

      // Berserker Surge Passive (Strength Lvl 20): +20% damage under 30% HP
      if (isAttackerPlayer && attacker.skills.strength?.lvl >= 20 && (attacker.hp / attacker.maxHp) <= 0.30) {
        maxHit = Math.floor(maxHit * 1.20);
      }

      if (maxHit > 0) {
        damage = Math.floor(Math.random() * maxHit) + 1;
      } else {
        damage = 0;
      }

      // Bleed & Poison application (Hunting Lvl 15 or Serpent Toxin)
      if (isAttackerPlayer && damage > 0 && Math.random() < 0.25) {
        if (attacker.skills.hunting?.lvl >= 15 && !defender.isBleeding) {
          defender.isBleeding = true;
          defender.bleedTicks = 6;
        }
      }
    }

    defender.hp = Math.max(0, defender.hp - damage);

    // Generate Hitsplat
    const hitsplat = {
      targetId: defender.id,
      damage,
      color: damage > 0 ? 'RED' : 'BLUE',
      tick: currentTick
    };

    // Award XP if attacker is player and damage dealt
    let xpEvents = [];
    if (isAttackerPlayer && damage > 0) {
      const combatSkill = attacker.skills.hunting ? 'hunting' : 'attack';
      const xpEv1 = attacker.addXp(combatSkill, damage * 4);
      const xpEv2 = attacker.addXp('strength', damage * 4);
      const xpEv3 = attacker.addXp('hitpoints', Math.floor(damage * 1.33));
      if (xpEv1.leveledUp) xpEvents.push(xpEv1);
      if (xpEv2.leveledUp) xpEvents.push(xpEv2);
      if (xpEv3.leveledUp) xpEvents.push(xpEv3);
    }

    // Handle Defender Death
    let deathEvent = null;
    if (defender.hp <= 0) {
      deathEvent = this.handleDeath(defender, attacker);
    }

    return { hitsplat, xpEvents, deathEvent };
  }

  handleDeath(victim, killer) {
    const isVictimPlayer = !victim.templateKey;

    if (!isVictimPlayer) {
      // Monster died
      victim.state = 'DEAD';
      victim.deadTicks = 0;

      // Roll drop table
      const drops = [];
      for (const drop of victim.drops) {
        if (Math.random() <= drop.chance) {
          const qty = drop.qty || (drop.min ? Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min : 1);
          const groundItem = this.world.addGroundItem({
            itemId: drop.id,
            name: ITEM_DEFINITIONS[drop.id] ? ITEM_DEFINITIONS[drop.id].name : drop.id,
            quantity: qty,
            x: victim.x,
            y: victim.y,
            icon: ITEM_DEFINITIONS[drop.id] ? ITEM_DEFINITIONS[drop.id].icon : '🎁'
          });
          drops.push(groundItem);
        }
      }

      return {
        type: 'MONSTER_DIED',
        monsterId: victim.id,
        killerId: killer.id,
        drops
      };
    } else {
      // Player died
      victim.hp = victim.maxHp;
      victim.x = 60; // Respawn at Ash-River Encampment
      victim.y = 84;
      victim.actionState = 'IDLE';
      victim.inCombat = false;
      victim.combatTarget = null;

      return {
        type: 'PLAYER_DIED',
        playerId: victim.id,
        respawnX: 60,
        respawnY: 84
      };
    }
  }
}
