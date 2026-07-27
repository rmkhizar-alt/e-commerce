/**
 * model-loader.js
 * ================
 * Three.js + GLTFLoader ke saath GLB model load karne ka
 * sahi, tested, cache-free tarika.
 *
 * FEATURES:
 *  - Cache-busting query string automatic
 *  - Loading progress bar
 *  - Error handling (MIME type, CORS, 404)
 *  - OrbitControls (rotate, zoom, pan)
 *  - Auto-center + auto-scale model
 *  - Responsive resize
 *  - Performance: draco compression support
 *
 * USAGE in HTML:
 *   <div id="model-container"></div>
 *   <script type="module" src="model-loader.js?v=2.0.0"></script>
 *
 * CONFIG niche MODEL_CONFIG mein karo.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader }    from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader }   from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ═══════════════════════════════════════════
//  CONFIG - Yahan apni settings karo
// ═══════════════════════════════════════════
const MODEL_CONFIG = {
  // GLB file ka path (apne file ka naam yahan likho)
 // Line ~35 par ye milegi:
modelPath: './models/shoe.glb',

  // Container div ka ID  
  containerId: 'model-container',

  // Camera settings
  fov:      45,
  near:     0.1,
  far:      1000,

  // Background color (ya 'transparent')
  background: 0xf0f0f0,

  // Light intensity
  ambientIntensity:     0.6,
  directionalIntensity: 1.2,

  // Auto-rotate
  autoRotate:      false,
  autoRotateSpeed: 2.0,

  // Cache buster - har update par badlo
  version: '2.0.0',
};
// ═══════════════════════════════════════════

// ── Cache-busted model URL ────────────────
const MODEL_URL = MODEL_CONFIG.modelPath + '?v=' + MODEL_CONFIG.version
                  + '&t=' + Date.now();

// ── DOM Elements ──────────────────────────
const container = document.getElementById(MODEL_CONFIG.containerId);

if (!container) {
  console.error('[ModelLoader] Container #' + MODEL_CONFIG.containerId + ' nahi mila!');
} else {
  initScene();
}

function initScene() {
  // ── Renderer ─────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth || 800, container.clientHeight || 600);
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // ── Scene ─────────────────────────────────
  const scene = new THREE.Scene();
  if (MODEL_CONFIG.background !== 'transparent') {
    scene.background = new THREE.Color(MODEL_CONFIG.background);
  }

  // ── Camera ────────────────────────────────
  const aspect = (container.clientWidth || 800) / (container.clientHeight || 600);
  const camera = new THREE.PerspectiveCamera(
    MODEL_CONFIG.fov,
    aspect,
    MODEL_CONFIG.near,
    MODEL_CONFIG.far
  );
  camera.position.set(0, 1, 3);

  // ── Lights ────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, MODEL_CONFIG.ambientIntensity);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, MODEL_CONFIG.directionalIntensity);
  dirLight.position.set(5, 10, 7.5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // ── Controls ──────────────────────────────
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping  = true;
  controls.dampingFactor  = 0.05;
  controls.autoRotate     = MODEL_CONFIG.autoRotate;
  controls.autoRotateSpeed = MODEL_CONFIG.autoRotateSpeed;
  controls.minDistance = 0.5;
  controls.maxDistance = 50;

  // ── Loading UI ────────────────────────────
  const loadingDiv = createLoadingUI(container);

  // ── GLTF Loader + DRACO ───────────────────
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  // ── Load Model ────────────────────────────
  loader.load(
    MODEL_URL,

    // ✅ Success
    function (gltf) {
      const model = gltf.scene;

      // Auto-center + auto-scale
      const box    = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale  = 2 / maxDim;

      model.position.sub(center.multiplyScalar(scale));
      model.scale.setScalar(scale);

      scene.add(model);
      removeLoadingUI(loadingDiv);

      // Camera ko model ke paas set karo
      camera.position.set(0, 0, maxDim * 1.5 * scale + 1);
      controls.target.set(0, 0, 0);
      controls.update();

      console.log('[ModelLoader] Model loaded OK:', MODEL_URL);
    },

    // 📊 Progress
    function (xhr) {
      if (xhr.lengthComputable) {
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        updateLoadingUI(loadingDiv, pct);
      }
    },

    // ❌ Error
    function (error) {
      console.error('[ModelLoader] LOAD ERROR:', error);
      showErrorUI(loadingDiv, error, MODEL_URL);
    }
  );

  // ── Animate ───────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // ── Responsive Resize ─────────────────────
  window.addEventListener('resize', function () {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ─── Loading UI helpers ───────────────────
function createLoadingUI(container) {
  const div = document.createElement('div');
  div.id = 'model-loading';
  div.style.cssText = [
    'position:absolute', 'inset:0',
    'display:flex', 'flex-direction:column',
    'align-items:center', 'justify-content:center',
    'background:rgba(0,0,0,0.6)',
    'color:#fff', 'font-family:sans-serif',
    'z-index:10', 'border-radius:inherit',
  ].join(';');
  div.innerHTML = `
    <div style="font-size:1rem;margin-bottom:12px;">3D Model Load Ho Raha Hai...</div>
    <div id="model-progress-bar" style="
      width:200px;height:6px;background:#333;border-radius:3px;overflow:hidden">
      <div id="model-progress-fill" style="
        width:0%;height:100%;background:#4fc3f7;transition:width 0.2s"></div>
    </div>
    <div id="model-progress-text" style="margin-top:8px;font-size:0.8rem;color:#aaa">0%</div>
  `;
  // Container relative hona chahiye
  const pos = window.getComputedStyle(container).position;
  if (pos === 'static') container.style.position = 'relative';
  container.appendChild(div);
  return div;
}

function updateLoadingUI(div, pct) {
  const fill = document.getElementById('model-progress-fill');
  const text = document.getElementById('model-progress-text');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent  = pct + '%';
}

function removeLoadingUI(div) {
  if (div && div.parentNode) div.parentNode.removeChild(div);
}

function showErrorUI(div, error, url) {
  if (!div) return;
  div.innerHTML = `
    <div style="text-align:center;padding:20px;max-width:400px">
      <div style="font-size:1.5rem;margin-bottom:8px">⚠️</div>
      <div style="font-size:1rem;color:#f44;margin-bottom:12px">Model Load Nahi Hua</div>
      <div style="font-size:0.75rem;color:#aaa;word-break:break-all">${url}</div>
      <div style="font-size:0.75rem;color:#f88;margin-top:8px">${error.message || error}</div>
      <div style="font-size:0.75rem;color:#aaa;margin-top:12px">
        ✅ server.py se server chalao<br>
        ✅ models/ folder mein GLB file check karo<br>
        ✅ MODEL_CONFIG.modelPath sahi karo
      </div>
    </div>
  `;
}
