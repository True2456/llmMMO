/**
 * Aetheria: Classic Realms - Client Main Loop & Coordinator
 */

import { Renderer } from './renderer.js';
import { RetroAudio } from './audio.js';
import { NetworkManager } from './network.js';
import { Web3Manager } from './web3.js';
import { UIManager } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const audio = new RetroAudio();
  const web3 = new Web3Manager();
  const renderer = new Renderer(canvas);

  let latestGameState = {
    self: null,
    players: [],
    npcs: [],
    nodes: [],
    groundItems: [],
    world: null
  };

  window.renderer = renderer;
  window.latestGameState = latestGameState;
  window.audio = audio;

  let processedChatIds = new Set();

  // Network Callbacks
  const network = new NetworkManager(
    // On Tick Delta
    (delta) => {
      latestGameState.self = delta.self;
      latestGameState.players = delta.players;
      latestGameState.npcs = delta.npcs;
      latestGameState.nodes = delta.nodes;
      latestGameState.groundItems = delta.groundItems;

      // Update UI Stats
      ui.updatePlayerStats(delta.self);

      // Process Hitsplats & Floating Action Text
      if (delta.hitsplats && delta.hitsplats.length > 0) {
        delta.hitsplats.forEach(h => {
          if (h.x !== undefined && h.y !== undefined) {
            renderer.addHitsplat(h.x, h.y, h.damage, h.color);
            if (h.isGather) audio.playCoin();
          } else {
            let target = delta.players.find(p => p.id === h.targetId) || delta.npcs.find(n => n.id === h.targetId);
            if (delta.self && delta.self.id === h.targetId) target = delta.self;
            if (target) {
              renderer.addHitsplat(target.x, target.y, h.damage, h.color);
              if (h.damage > 0) audio.playHit();
            }
          }
        });
      }

      // Process Level-ups
      if (delta.levelUps && delta.levelUps.length > 0) {
        delta.levelUps.forEach(ev => ui.showLevelUp(ev));
      }

      // Process Chat Messages
      if (delta.recentChat) {
        delta.recentChat.forEach(msg => {
          if (!processedChatIds.has(msg.id)) {
            processedChatIds.add(msg.id);
            ui.addChatMessage(msg);
            renderer.addSpeechBubble(msg.from, msg.text, msg.isAgent);
          }
        });
      }
    },
    // On Welcome
    (welcome) => {
      latestGameState.world = welcome.world;
      console.log(`[PRIMA] Welcome to the Ancient Realm, ${welcome.username}!`);
    }
  );

  const ui = new UIManager(network, audio, web3, renderer.spriteEngine);

  window.latestGameState = latestGameState;
  window.renderer = renderer;
  window.network = network;
  window.ui = ui;

  // Resize canvas to fill viewport container
  window.addEventListener('resize', () => renderer.resize());
  renderer.resize();

  // Precise Canvas Coordinate Translation
  const getCanvasCoords = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Hover Feedback & Dynamic Cursor
  canvas.addEventListener('mousemove', (e) => {
    const { x: mouseX, y: mouseY } = getCanvasCoords(e);
    const hit = renderer.findTargetAtScreen(mouseX, mouseY, latestGameState);

    if (hit.type === 'NPC') {
      canvas.style.cursor = 'crosshair';
      canvas.title = `Attack ${hit.target.name} (Lv ${hit.target.combatLvl})`;
    } else if (hit.type === 'NODE') {
      canvas.style.cursor = 'pointer';
      canvas.title = `Gather ${hit.target.name} (${hit.target.skill.toUpperCase()})`;
    } else if (hit.type === 'ITEM') {
      canvas.style.cursor = 'pointer';
      canvas.title = `Take ${hit.target.name}`;
    } else {
      canvas.style.cursor = 'default';
      canvas.title = `Walk here (${hit.worldX}, ${hit.worldY})`;
    }
  });

  // Context Menu Handling (Persistent on click, auto-dismiss on mouse off or click outside)
  const contextMenuEl = document.getElementById('context-menu');
  let menuOpenedAt = 0;
  let mouseLeaveTimeout = null;

  const hideContextMenu = () => {
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout);
      mouseLeaveTimeout = null;
    }
    if (contextMenuEl) contextMenuEl.classList.add('hidden');
  };

  // Auto-dismiss when cursor leaves menu area
  if (contextMenuEl) {
    contextMenuEl.addEventListener('mouseleave', () => {
      mouseLeaveTimeout = setTimeout(() => {
        hideContextMenu();
      }, 300);
    });

    contextMenuEl.addEventListener('mouseenter', () => {
      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout);
        mouseLeaveTimeout = null;
      }
    });
  }

  // Dismiss when clicking anywhere outside
  window.addEventListener('pointerdown', (e) => {
    if (Date.now() - menuOpenedAt < 120) return;
    if (contextMenuEl && !contextMenuEl.contains(e.target)) {
      hideContextMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideContextMenu();
  });

  const showContextMenu = (clientX, clientY, hit) => {
    if (!contextMenuEl) return;
    menuOpenedAt = Date.now();
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout);
      mouseLeaveTimeout = null;
    }

    contextMenuEl.innerHTML = '';

    const viewportRect = document.getElementById('viewport-container').getBoundingClientRect();
    let posX = clientX - viewportRect.left;
    let posY = clientY - viewportRect.top;

    let headerTitle = `(${hit.worldX}, ${hit.worldY})`;
    const options = [];

    if (hit.type === 'NPC') {
      const npc = hit.target;
      headerTitle = npc.isTownNpc ? `${npc.name}` : `${npc.name} (Lv ${npc.combatLvl})`;

      if (npc.isTownNpc) {
        options.push({
          label: `💬 Talk to ${npc.name}`,
          className: 'examine',
          action: () => {
            ui.openDialogue(npc);
            network.talkNPC(npc.id);
            audio.playTone(380, 'sine', 0.06);
          }
        });
      } else {
        options.push({
          label: `⚔️ Attack ${npc.name}`,
          className: 'attack',
          action: () => {
            renderer.addClickReticle(npc.x, npc.y, 'ATTACK');
            network.attackNPC(npc.id);
            audio.playTone(220, 'square', 0.05);
          }
        });
      }

      options.push({
        label: `👁️ Examine ${npc.name}`,
        className: 'examine',
        action: () => {
          ui.addChatMessage({
            from: 'Examine',
            badge: 'PRIMA',
            text: npc.isTownNpc ? `${npc.name}: Respected elder of the Ash-River tribe.` : `${npc.name}: Level ${npc.combatLvl} creature. HP: ${npc.hp}/${npc.maxHp}.`
          });
        }
      });
    } else if (hit.type === 'NODE') {
      const node = hit.target;
      headerTitle = `${node.name || 'Resource Node'}`;
      if (node.isStation) {
        if (node.stationType === 'STATION_STASH' || node.type.includes('STASH')) {
          options.push({
            label: `📦 Open Tribal Stash Vault`,
            className: 'gather',
            action: () => {
              ui.openStashVault(latestGameState.self);
              network.send({ type: 'OPEN_STASH' });
              audio.playTone(440, 'triangle', 0.08);
            }
          });
        } else {
          options.push({
            label: `⚒️ Use ${node.name}`,
            className: 'gather',
            action: () => {
              ui.openCraftingStation(node, latestGameState.self);
              network.interactResource(node.id);
              audio.playTone(440, 'triangle', 0.08);
            }
          });
        }
      } else {
        const actionVerb = node.type.includes('TREE') ? 'Chop' :
                           (node.type.includes('BOULDER') || node.type.includes('ROCK') || node.type.includes('CRAG')) ? 'Mine' : 'Gather';
        options.push({
          label: `⛏️ ${actionVerb} ${node.name || 'Resource'}`,
          className: 'gather',
          action: () => {
            renderer.addClickReticle(node.x, node.y, 'GATHER');
            network.interactResource(node.id);
            if (node.type.includes('ROCK') || node.type.includes('BOULDER')) audio.playMining();
            else if (node.type.includes('TREE')) audio.playWoodcutting();
          }
        });
      }
      options.push({
        label: `👁️ Examine ${node.name || 'Resource'}`,
        className: 'examine',
        action: () => {
          ui.addChatMessage({
            from: 'Examine',
            badge: 'PRIMA',
            text: node.isStation ? `${node.name}: Regional crafting workshop for the ${node.skill.toUpperCase()} skill.` : `${node.name}: Requires ${node.skill.toUpperCase()} Level ${node.reqLvl}. Yields ${node.item || 'materials'}.`
          });
        }
      });
    } else if (hit.type === 'ITEM') {
      const item = hit.target;
      headerTitle = `${item.name}`;
      options.push({
        label: `🟡 Take ${item.name}`,
        className: 'loot',
        action: () => {
          renderer.addClickReticle(item.x, item.y, 'LOOT');
          network.pickupItem(item.id);
          audio.playCoin();
        }
      });
      options.push({
        label: `👁️ Examine ${item.name}`,
        className: 'examine',
        action: () => {
          ui.addChatMessage({
            from: 'Examine',
            badge: 'PRIMA',
            text: `${item.name}: Found on the ground at (${item.x}, ${item.y}).`
          });
        }
      });
    }

    // Default Options for any coordinate
    options.push({
      label: `👣 Walk here`,
      className: 'walk',
      action: () => {
        renderer.addClickReticle(hit.worldX, hit.worldY, 'MOVE');
        network.move(hit.worldX, hit.worldY);
        audio.playTone(440, 'sine', 0.04, 0.08);
      }
    });

    options.push({
      label: `❌ Cancel`,
      className: 'cancel',
      action: () => hideContextMenu()
    });

    // Render Menu Header
    const headerEl = document.createElement('div');
    headerEl.className = 'context-menu-header';
    headerEl.textContent = headerTitle;
    contextMenuEl.appendChild(headerEl);

    // Render Options
    for (const opt of options) {
      const itemEl = document.createElement('div');
      itemEl.className = `context-menu-item ${opt.className || ''}`;
      itemEl.textContent = opt.label;
      itemEl.addEventListener('click', (e) => {
        e.stopPropagation();
        hideContextMenu();
        opt.action();
      });
      contextMenuEl.appendChild(itemEl);
    }

    // Position and show menu
    contextMenuEl.classList.remove('hidden');
    
    // Clamp to viewport
    const menuWidth = 210;
    const menuHeight = options.length * 28 + 32;
    if (posX + menuWidth > viewportRect.width) posX = viewportRect.width - menuWidth - 10;
    if (posY + menuHeight > viewportRect.height) posY = viewportRect.height - menuHeight - 10;

    contextMenuEl.style.left = `${Math.max(5, posX)}px`;
    contextMenuEl.style.top = `${Math.max(5, posY)}px`;
  };

  // Right-Click Context Menu Trigger
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    audio.init();
    const { x: clickX, y: clickY } = getCanvasCoords(e);
    const hit = renderer.findTargetAtScreen(clickX, clickY, latestGameState);
    showContextMenu(e.clientX, e.clientY, hit);
  });

  // Left-Click Mouse Interaction (Minimap Navigation / Attack / Mine / Gather / Move)
  canvas.addEventListener('click', (e) => {
    if (Date.now() - menuOpenedAt < 150) return;
    hideContextMenu();
    audio.init();
    const { x: clickX, y: clickY } = getCanvasCoords(e);

    // 0. Minimap Click-to-Walk
    const minimapTarget = renderer.getMinimapWorldCoord(clickX, clickY, latestGameState.self);
    if (minimapTarget) {
      renderer.addClickReticle(minimapTarget.worldX, minimapTarget.worldY, 'MOVE');
      network.move(minimapTarget.worldX, minimapTarget.worldY);
      audio.playTone(440, 'sine', 0.04, 0.08);
      return;
    }

    const hit = renderer.findTargetAtScreen(clickX, clickY, latestGameState);

    // 1. Attack Monster / Talk to Town NPC
    if (hit.type === 'NPC') {
      const npc = hit.target;
      if (npc.isTownNpc) {
        ui.openDialogue(npc);
        network.talkNPC(npc.id);
        audio.playTone(380, 'sine', 0.06);
        return;
      }
      renderer.addClickReticle(npc.x, npc.y, 'ATTACK');
      network.attackNPC(npc.id);
      audio.playTone(220, 'square', 0.05);
      return;
    }

    // 2. Gather Resource Node or Open Crafting Station
    if (hit.type === 'NODE') {
      const node = hit.target;
      if (node.isStation) {
        if (node.stationType === 'STATION_STASH' || node.type.includes('STASH')) {
          ui.openStashVault(latestGameState.self);
          network.send({ type: 'OPEN_STASH' });
          audio.playTone(440, 'triangle', 0.08);
        } else {
          ui.openCraftingStation(node, latestGameState.self);
          network.interactResource(node.id);
          audio.playTone(440, 'triangle', 0.08);
        }
        return;
      }
      renderer.addClickReticle(node.x, node.y, 'GATHER');
      network.interactResource(node.id);
      if (node.type.includes('ROCK') || node.type.includes('BOULDER') || node.type.includes('CRAG')) {
        audio.playMining();
      } else if (node.type.includes('TREE')) {
        audio.playWoodcutting();
      } else {
        audio.playTone(330, 'sine', 0.05);
      }
      return;
    }

    // 3. Loot Ground Item
    if (hit.type === 'ITEM') {
      const item = hit.target;
      renderer.addClickReticle(item.x, item.y, 'LOOT');
      network.pickupItem(item.id);
      audio.playCoin();
      return;
    }

    // 4. Default: Move to clicked ground tile with Yellow Reticle
    renderer.addClickReticle(hit.worldX, hit.worldY, 'MOVE');
    network.move(hit.worldX, hit.worldY);
    audio.playTone(440, 'sine', 0.04, 0.08);
  });

  // Connect to Game Server
  network.connect();

  // Main Render Loop (60 FPS Smooth Rendering)
  function renderLoop(time) {
    renderer.render(latestGameState, time);
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
});
