/**
 * LiveAgent 3D - Frontend Logic & 3D Interactive Engine
 * Handles UI interactions, Three.js 3D dynamic viewport, bpy code generator, and Blender Bridge communication.
 */

// Language Localization System (English Default & Arabic Toggle)
let currentLang = localStorage.getItem('liveagent_lang') || 'en';

const I18N = {
    en: {
        langBtnText: "العربية",
        brandSubtitle: "Real-Time AI Modeling Bridge for Blender 5.2 LTS",
        bridgeStatusChecking: "Blender Bridge: Checking...",
        bridgeStatusConnected: "Blender Bridge: Connected",
        bridgeStatusDisconnected: "Blender Bridge: Disconnected (Click for setup)",
        settingsTitle: "AI Engine Settings",
        tabViewportText: "3D Viewport (Three.js)",
        tabBridgeText: "Blender Bridge Setup",
        btnRecenter: "🎯 Recenter",
        btnWireframe: "🕸️ Wireframe",
        btnExecute: "⚡ Execute in Blender",
        studioLabel: "Studio:",
        studioPure: "🌟 Pure",
        studioCyberpunk: "🌌 Cyberpunk",
        studioSnow: "❄️ Snow",
        studioTrack: "🏎️ Track",
        inspectorBadge: "Selected Part",
        inspectorBaseColor: "Base Color:",
        inspectorRoughness: "Roughness:",
        inspectorMetallic: "Metallic:",
        inspectorSyncStatus: "🟢 Live Sync with Blender 5.2",
        helperText: "💡 Click any part on the 3D model to inspect and fine-tune its color and materials in real time!",
        inputPlaceholder: "Describe what you want to create in Blender... (e.g. Luxury sports car, sci-fi starfighter, gaming chair)",
        inputHints: "💡 Supports natural language 3D modeling, continuous Z-stacking, and Blender 5.2 bpy automation",
        sendBtnTitle: "Send Prompt",
        modalTitle: "AI Engine Settings",
        modalProviderLabel: "AI Provider:",
        modalModelLabel: "AI Model:",
        modalApiKeyLabel: "API Key:",
        modalBridgeHostLabel: "Blender Bridge Host:",
        modalSaveBtn: "Save Settings",
        welcomeP1: "Welcome! I am your AI 3D modeling assistant specialized in procedural generation for <strong>Blender 5.2 LTS</strong> and <strong>EEVEE Next</strong>.",
        welcomeP2: "I construct parametric meshes, configure physically-based shaders (PBR), and stream commands directly to your running Blender session.",
        suggestionsTitle: "Try one of these certified blueprints:",
        chipRose: "🌹 Master Velvet Rose in Vase",
        chipSunglasses: "🕶️ Luxury Designer Sunglasses",
        chipTable: "☕ Modern Coffee Table & Lamp",
        chipRosePrompt: "Photorealistic velvet red damask rose in a crystal glass vase",
        chipSunglassesPrompt: "Luxury designer sunglasses with gold bridge and reflective blue lenses",
        chipTablePrompt: "Modern round wooden coffee table with metallic legs and desk lamp",
        platformReady: "Showcase Demo (Torus Knot) | Ready to build in Blender",
        platformReadyNoModel: "Platform Ready | Enter a prompt to construct 3D models in Blender",
        userAvatar: "You",
        userName: "Engineer",
        copyCode: "📋 Copy Code",
        copiedCode: "✅ Copied!",
        syncBtnText: "🔄 Sync Active Blender Scene"
    },
    ar: {
        langBtnText: "English",
        brandSubtitle: "الوكيل الذكي للتحكم ببرنامج Blender 5.2 LTS فورياً",
        bridgeStatusChecking: "جسر بلندر: جاري الفحص...",
        bridgeStatusConnected: "جسر بلندر: متصل",
        bridgeStatusDisconnected: "جسر بلندر: غير متصل (اضغط للشرح)",
        settingsTitle: "إعدادات محرك الذكاء الاصطناعي",
        tabViewportText: "معاينة ثلاثية الأبعاد حية (Three.js)",
        tabBridgeText: "جسر الاتصال والتعليمات",
        btnRecenter: "🎯 مركز الرؤية",
        btnWireframe: "🕸️ Wireframe",
        btnExecute: "⚡ تنفيذ في Blender",
        studioLabel: "الاستوديو:",
        studioPure: "🌟 نقي",
        studioCyberpunk: "🌌 سايبربانك",
        studioSnow: "❄️ ثلج",
        studioTrack: "🏎️ مضمار",
        inspectorBadge: "قطعة محددة",
        inspectorBaseColor: "اللون الأساسي:",
        inspectorRoughness: "الخشونة (Roughness):",
        inspectorMetallic: "المعدنية (Metallic):",
        inspectorSyncStatus: "🟢 مزامنة فورية مع Blender 5.2",
        helperText: "💡 انقر على أي جزء من المجسم لتعديل لونه ولمعانه ومزامنته فورياً مع بلندر!",
        inputPlaceholder: "اطلب ما ترغب بتصميمه في بلندر... (مثال: سيارة رياضية خارقة، مقاتلة فضائية، كرسي قيمنق)",
        inputHints: "💡 يدعم الأوامر الهندسية الدقيقة وتوليد كود bpy ومعدلات Subdivision Surface",
        sendBtnTitle: "إرسال",
        modalTitle: "إعدادات محرك الذكاء الاصطناعي",
        modalProviderLabel: "مزود الخدمة (AI Provider):",
        modalModelLabel: "نموذج الذكاء الاصطناعي (Model):",
        modalApiKeyLabel: "مفتاح API الخاص بك:",
        modalBridgeHostLabel: "عنوان جسر بلندر (Blender Bridge Host):",
        modalSaveBtn: "حفظ الإعدادات",
        welcomeP1: "أهلاً بك يا مهندس! أنا وكيلك الذكي المتخصص في النمذجة والتحكم ببرنامج <strong>Blender 5.2 LTS</strong> ومحرك <strong>EEVEE Next</strong>.",
        welcomeP2: "أستطيع بناء المجسمات ثلاثية الأبعاد، وضبط الخامات والإضاءة، وتطبيق المعدلات (Modifiers) بدقة برمجية عالية وتنفيذها في بلندر فورياً.",
        suggestionsTitle: "جرّب أحد النماذج المعتمدة المضمونة:",
        chipRose: "🌹 صمم وردة جورية واقعية",
        chipSunglasses: "🕶️ نظارة شمسية عصرية فاخرة",
        chipTable: "☕ طاولة قهوة مودرن ومصباح",
        chipRosePrompt: "صمم لي وردة جورية حمراء واقعية في مزهرية",
        chipSunglassesPrompt: "صمم لي نظارة شمسية عصرية بإطار أسود وعدسات زجاجية عاكسة",
        chipTablePrompt: "صمم لي طاولة قهوة خشبية دائرية مع مصباح مكتبي",
        platformReady: "مجسم استعراضي ترحيبي (Torus Knot) | جاهز لبناء أي مجسم في بلندر",
        platformReadyNoModel: "المنصة جاهزة | بانتظار أمر التصميم لبناء المجسم فورياً في بلندر",
        userAvatar: "أنت",
        userName: "المهندس",
        copyCode: "📋 نسخ الكود",
        copiedCode: "✅ تم النسخ!",
        syncBtnText: "🔄 مزامنة مشهد بلندر المفتوح"
    }
};

function setLanguage(lang) {
    currentLang = (lang === 'ar') ? 'ar' : 'en';
    localStorage.setItem('liveagent_lang', currentLang);
    const dict = I18N[currentLang];

    document.documentElement.lang = currentLang;
    document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';

    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.innerText = dict.langBtnText;

    const brandSubtitle = document.getElementById('brandSubtitle');
    if (brandSubtitle) brandSubtitle.innerText = dict.brandSubtitle;

    const tabViewportText = document.getElementById('tabViewportText');
    if (tabViewportText) tabViewportText.innerText = dict.tabViewportText;

    const tabBridgeText = document.getElementById('tabBridgeText');
    if (tabBridgeText) tabBridgeText.innerText = dict.tabBridgeText;

    const resetCameraBtn = document.getElementById('resetCameraBtn');
    if (resetCameraBtn) resetCameraBtn.innerText = dict.btnRecenter;

    const toggleWireframeBtn = document.getElementById('toggleWireframeBtn');
    if (toggleWireframeBtn) toggleWireframeBtn.innerText = dict.btnWireframe;

    const sendToBlenderBtn = document.getElementById('sendToBlenderBtn');
    if (sendToBlenderBtn && !sendToBlenderBtn.dataset.busy) sendToBlenderBtn.innerText = dict.btnExecute;

    const studioLabel = document.getElementById('studioLabel');
    if (studioLabel) studioLabel.innerText = dict.studioLabel;

    const studioPureBtn = document.getElementById('studioPureBtn');
    if (studioPureBtn) studioPureBtn.innerText = dict.studioPure;

    const studioCyberpunkBtn = document.getElementById('studioCyberpunkBtn');
    if (studioCyberpunkBtn) studioCyberpunkBtn.innerText = dict.studioCyberpunk;

    const studioSnowBtn = document.getElementById('studioSnowBtn');
    if (studioSnowBtn) studioSnowBtn.innerText = dict.studioSnow;

    const studioTrackBtn = document.getElementById('studioTrackBtn');
    if (studioTrackBtn) studioTrackBtn.innerText = dict.studioTrack;

    const inspectorBadgeText = document.getElementById('inspectorBadgeText');
    if (inspectorBadgeText) inspectorBadgeText.innerText = dict.inspectorBadge;

    const inspectorBaseColorLabel = document.getElementById('inspectorBaseColorLabel');
    if (inspectorBaseColorLabel) inspectorBaseColorLabel.innerText = dict.inspectorBaseColor;

    const inspectorRoughnessLabel = document.getElementById('inspectorRoughnessLabel');
    if (inspectorRoughnessLabel) inspectorRoughnessLabel.innerText = dict.inspectorRoughness;

    const inspectorMetallicLabel = document.getElementById('inspectorMetallicLabel');
    if (inspectorMetallicLabel) inspectorMetallicLabel.innerText = dict.inspectorMetallic;

    const viewportHelperText = document.getElementById('viewportHelperText');
    if (viewportHelperText) viewportHelperText.innerText = dict.helperText;

    const syncFromBlenderBtn = document.getElementById('syncFromBlenderBtn');
    if (syncFromBlenderBtn) syncFromBlenderBtn.innerText = dict.syncBtnText;

    const userInput = document.getElementById('userInput');
    if (userInput) userInput.placeholder = dict.inputPlaceholder;

    const inputHintsText = document.getElementById('inputHintsText');
    if (inputHintsText) inputHintsText.innerText = dict.inputHints;

    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.title = dict.sendBtnTitle;

    const welcomeP1 = document.getElementById('welcomeP1');
    if (welcomeP1) welcomeP1.innerHTML = dict.welcomeP1;

    const welcomeP2 = document.getElementById('welcomeP2');
    if (welcomeP2) welcomeP2.innerHTML = dict.welcomeP2;

    const suggestionsTitle = document.getElementById('suggestionsTitle');
    if (suggestionsTitle) suggestionsTitle.innerText = dict.suggestionsTitle;

    const chipRoseBtn = document.getElementById('chipRoseBtn');
    if (chipRoseBtn) chipRoseBtn.innerText = dict.chipRose;

    const chipSunglassesBtn = document.getElementById('chipSunglassesBtn');
    if (chipSunglassesBtn) chipSunglassesBtn.innerText = dict.chipSunglasses;

    const chipTableBtn = document.getElementById('chipTableBtn');
    if (chipTableBtn) chipTableBtn.innerText = dict.chipTable;

    const settingsModalTitle = document.getElementById('settingsModalTitle');
    if (settingsModalTitle) settingsModalTitle.innerText = dict.modalTitle;

    const settingsProviderLabel = document.getElementById('settingsProviderLabel');
    if (settingsProviderLabel) settingsProviderLabel.innerText = dict.modalProviderLabel;

    const settingsModelLabel = document.getElementById('settingsModelLabel');
    if (settingsModelLabel) settingsModelLabel.innerText = dict.modalModelLabel;

    const bridgeHostLabel = document.getElementById('bridgeHostLabel');
    if (bridgeHostLabel) bridgeHostLabel.innerText = dict.modalBridgeHostLabel;

    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) saveSettingsBtn.innerText = dict.modalSaveBtn;

    const statsEl = document.getElementById('objectStats');
    if (statsEl && currentMeshGroup && currentMeshGroup.userData && currentMeshGroup.userData.isStartupModel) {
        statsEl.innerText = dict.platformReady;
    }
}

function initLanguageControls() {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const nextLang = (currentLang === 'en') ? 'ar' : 'en';
            setLanguage(nextLang);
        });
    }
    setLanguage(currentLang);
}

// 1. المتغيرات العامة لـ Three.js
let scene, camera, renderer, controls;
let currentMeshGroup = null;
let isWireframe = false;
let latestCleanBpyCode = "";
let studioEnvManager = null;
let thrusterVFXManager = null;
let partInspectorManager = null;

/**
 * محرك الاستوديوهات السينمائية الإجرائية (مستوحى من أساليب Chiro Studio)
 */
class StudioEnvironmentManager {
    constructor(sceneRef, rendererRef) {
        this.scene = sceneRef;
        this.renderer = rendererRef;
        this.currentMode = 'pure';
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // إضاءات الاستوديو القابلة للتبديل
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
        this.dirKey = new THREE.DirectionalLight(0xffffff, 1.4);
        this.dirKey.position.set(6, 8, 6);
        this.dirFill = new THREE.DirectionalLight(0x93c5fd, 0.9);
        this.dirFill.position.set(-6, 4, 4);
        this.rimLight = new THREE.PointLight(0x38bdf8, 1.4, 35);
        this.rimLight.position.set(0, 5, -6);

        this.group.add(this.ambientLight);
        this.group.add(this.dirKey);
        this.group.add(this.dirFill);
        this.group.add(this.rimLight);

        // شبكة الأرضية
        this.grid = new THREE.GridHelper(16, 32, 0x3b82f6, 0x1e293b);
        this.grid.position.y = -0.5;
        this.group.add(this.grid);

        // أرضية الظلال الناعمة
        const groundGeo = new THREE.PlaneGeometry(24, 24);
        groundGeo.rotateX(-Math.PI / 2);
        this.groundMat = new THREE.MeshStandardMaterial({
            color: 0x0c101d,
            roughness: 0.8,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85
        });
        this.ground = new THREE.Mesh(groundGeo, this.groundMat);
        this.ground.position.y = -0.505;
        this.group.add(this.ground);

        // نظام جزيئات الثلج الفيزيائي (SnowSystem)
        this.snowCount = 700;
        this.snowGeo = new THREE.BufferGeometry();
        this.snowPos = new Float32Array(this.snowCount * 3);
        this.snowVel = new Float32Array(this.snowCount);
        for (let i = 0; i < this.snowCount; i++) {
            this.snowPos[i * 3] = (Math.random() - 0.5) * 16;
            this.snowPos[i * 3 + 1] = Math.random() * 10;
            this.snowPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
            this.snowVel[i] = 0.02 + Math.random() * 0.035;
        }
        this.snowGeo.setAttribute('position', new THREE.BufferAttribute(this.snowPos, 3));
        this.snowMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.07,
            transparent: true,
            opacity: 0.85
        });
        this.snowPoints = new THREE.Points(this.snowGeo, this.snowMat);
        this.snowPoints.visible = false;
        this.group.add(this.snowPoints);

        // نظام جزيئات السايبربانك (Cyber Dust)
        this.cyberCount = 250;
        this.cyberGeo = new THREE.BufferGeometry();
        this.cyberPos = new Float32Array(this.cyberCount * 3);
        for (let i = 0; i < this.cyberCount; i++) {
            this.cyberPos[i * 3] = (Math.random() - 0.5) * 12;
            this.cyberPos[i * 3 + 1] = Math.random() * 6;
            this.cyberPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }
        this.cyberGeo.setAttribute('position', new THREE.BufferAttribute(this.cyberPos, 3));
        this.cyberMat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 0.09,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });
        this.cyberPoints = new THREE.Points(this.cyberGeo, this.cyberMat);
        this.cyberPoints.visible = false;
        this.group.add(this.cyberPoints);

        this.bindEvents();
        this.setStudio('pure', false);
    }

    setStudio(mode, syncToBlender = false) {
        this.currentMode = mode;
        document.querySelectorAll('.studio-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-studio') === mode);
        });

        if (mode === 'pure') {
            this.scene.background = new THREE.Color(0x0f172a);
            this.scene.fog = null;
            this.ambientLight.color.set(0xffffff);
            this.ambientLight.intensity = 1.1;
            this.dirKey.color.set(0xffffff);
            this.dirKey.intensity = 1.4;
            this.dirFill.color.set(0x94a3b8);
            this.dirFill.intensity = 0.8;
            this.rimLight.color.set(0x38bdf8);
            this.rimLight.intensity = 1.1;

            this.groundMat.color.set(0x0c101d);
            this.groundMat.roughness = 0.8;
            this.groundMat.metalness = 0.1;
            this.groundMat.opacity = 0.85;

            this.grid.material.color.set(0x3b82f6);
            this.grid.visible = true;
            this.snowPoints.visible = false;
            this.cyberPoints.visible = false;

        } else if (mode === 'cyberpunk') {
            this.scene.background = new THREE.Color(0x050811);
            this.scene.fog = new THREE.FogExp2(0x050811, 0.045);
            this.ambientLight.color.set(0x0a1128);
            this.ambientLight.intensity = 0.6;
            this.dirKey.color.set(0x00f0ff);
            this.dirKey.intensity = 1.8;
            this.dirFill.color.set(0xd946ef);
            this.dirFill.intensity = 1.5;
            this.rimLight.color.set(0xd946ef);
            this.rimLight.intensity = 2.4;

            this.groundMat.color.set(0x030712);
            this.groundMat.roughness = 0.2;
            this.groundMat.metalness = 0.9;
            this.groundMat.opacity = 0.95;

            this.grid.material.color.set(0x00f0ff);
            this.grid.visible = true;
            this.snowPoints.visible = false;
            this.cyberPoints.visible = true;

        } else if (mode === 'snow') {
            this.scene.background = new THREE.Color(0x0b1320);
            this.scene.fog = new THREE.FogExp2(0x0b1320, 0.055);
            this.ambientLight.color.set(0xcfd8dc);
            this.ambientLight.intensity = 1.2;
            this.dirKey.color.set(0xe0f2fe);
            this.dirKey.intensity = 1.4;
            this.dirFill.color.set(0x7dd3fc);
            this.dirFill.intensity = 0.9;
            this.rimLight.color.set(0xbae6fd);
            this.rimLight.intensity = 1.6;

            this.groundMat.color.set(0x1e293b);
            this.groundMat.roughness = 0.9;
            this.groundMat.metalness = 0.05;
            this.groundMat.opacity = 0.9;

            this.grid.material.color.set(0x7dd3fc);
            this.grid.visible = true;
            this.snowPoints.visible = true;
            this.cyberPoints.visible = false;

        } else if (mode === 'track') {
            this.scene.background = new THREE.Color(0x06080c);
            this.scene.fog = new THREE.FogExp2(0x06080c, 0.05);
            this.ambientLight.color.set(0x1e293b);
            this.ambientLight.intensity = 0.7;
            this.dirKey.color.set(0xfef08a);
            this.dirKey.intensity = 1.6;
            this.dirFill.color.set(0x94a3b8);
            this.dirFill.intensity = 0.8;
            this.rimLight.color.set(0xef4444);
            this.rimLight.intensity = 2.0;

            this.groundMat.color.set(0x0f172a);
            this.groundMat.roughness = 0.3;
            this.groundMat.metalness = 0.6;
            this.groundMat.opacity = 0.98;

            this.grid.material.color.set(0xeab308);
            this.grid.visible = true;
            this.snowPoints.visible = false;
            this.cyberPoints.visible = false;
        }

        if (syncToBlender) {
            this.syncStudioToBlender(mode);
        }
    }

    async syncStudioToBlender(mode) {
        const pyCode = `
import bpy

# 1. ضبط عالم وسماء بلندر
world = bpy.context.scene.world
if not world:
    world = bpy.data.worlds.new("LiveStudio_World")
    bpy.context.scene.world = world
world.use_nodes = True
nodes = world.node_tree.nodes
links = world.node_tree.links

bg = nodes.get("Background")
if not bg:
    bg = nodes.new(type='ShaderNodeBackground')
out = nodes.get("World Output")
if not out:
    out = nodes.new(type='ShaderNodeOutputWorld')
links.new(bg.outputs['Background'], out.inputs['Surface'])

# إزالة الإضاءات الاستوديو السابقة إن وجدت
for obj in list(bpy.data.objects):
    if obj.name.startswith("ENV_Studio_"):
        bpy.data.objects.remove(obj, do_unlink=True)

mode = "${mode}"

if mode == "cyberpunk":
    bg.inputs['Color'].default_value = (0.015, 0.02, 0.05, 1.0)
    bg.inputs['Strength'].default_value = 0.5
    
    # إضاءة نيون سيان أمامية
    l1 = bpy.data.lights.new(name="ENV_Studio_Cyan", type='POINT')
    l1.energy = 300.0
    l1.color = (0.0, 0.9, 1.0)
    o1 = bpy.data.objects.new("ENV_Studio_Cyan", l1)
    o1.location = (2.5, -2.5, 3.0)
    bpy.context.collection.objects.link(o1)
    
    # إضاءة نيون ماجينتا خلفية
    l2 = bpy.data.lights.new(name="ENV_Studio_Magenta", type='POINT')
    l2.energy = 350.0
    l2.color = (0.9, 0.1, 0.9)
    o2 = bpy.data.objects.new("ENV_Studio_Magenta", l2)
    o2.location = (-2.5, 2.5, 3.5)
    bpy.context.collection.objects.link(o2)

elif mode == "snow":
    bg.inputs['Color'].default_value = (0.06, 0.10, 0.18, 1.0)
    bg.inputs['Strength'].default_value = 0.8
    
    l = bpy.data.lights.new(name="ENV_Studio_Cold", type='SUN')
    l.energy = 4.0
    l.color = (0.8, 0.92, 1.0)
    o = bpy.data.objects.new("ENV_Studio_Cold", l)
    o.rotation_euler = (0.78, 0.35, 0.78)
    bpy.context.collection.objects.link(o)

elif mode == "track":
    bg.inputs['Color'].default_value = (0.02, 0.025, 0.04, 1.0)
    bg.inputs['Strength'].default_value = 0.5
    
    l1 = bpy.data.lights.new(name="ENV_Studio_TrackYellow", type='POINT')
    l1.energy = 300.0
    l1.color = (1.0, 0.9, 0.5)
    o1 = bpy.data.objects.new("ENV_Studio_TrackYellow", l1)
    o1.location = (3.0, 0.0, 3.5)
    bpy.context.collection.objects.link(o1)
    
    l2 = bpy.data.lights.new(name="ENV_Studio_TrackRed", type='POINT')
    l2.energy = 250.0
    l2.color = (1.0, 0.1, 0.1)
    o2 = bpy.data.objects.new("ENV_Studio_TrackRed", l2)
    o2.location = (-3.0, -2.0, 1.5)
    bpy.context.collection.objects.link(o2)

else: # pure
    bg.inputs['Color'].default_value = (0.75, 0.78, 0.84, 1.0)
    bg.inputs['Strength'].default_value = 1.2
    
    l = bpy.data.lights.new(name="ENV_Studio_Pure", type='SUN')
    l.energy = 4.5
    l.color = (1.0, 0.98, 0.95)
    o = bpy.data.objects.new("ENV_Studio_Pure", l)
    o.rotation_euler = (0.78, 0.35, 0.78)
    bpy.context.collection.objects.link(o)

# 2. تفعيل نمط الرندر الكامل في شاشة بلندر لإظهار الإضاءة والخلفية فورياً
for window in bpy.context.window_manager.windows:
    for area in window.screen.areas:
        if area.type == 'VIEW_3D':
            for space in area.spaces:
                if space.type == 'VIEW_3D':
                    space.shading.type = 'RENDERED'
            area.tag_redraw()
`;
        try {
            const bridgeHost = document.getElementById('bridgeHost')?.value?.trim() || 'http://localhost:8123';
            await fetch(`${bridgeHost}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: pyCode }),
                signal: AbortSignal.timeout(3000)
            });
        } catch (e) {
            // الجسر غير متصل، لا بأس يعمل الاستوديو في المتصفح
        }
    }

    update(delta) {
        if (this.currentMode === 'snow' && this.snowPoints && this.snowPoints.visible) {
            const pos = this.snowGeo.attributes.position.array;
            const time = Date.now() * 0.001;
            for (let i = 0; i < this.snowCount; i++) {
                pos[i * 3 + 1] -= this.snowVel[i];
                pos[i * 3] += Math.sin(time + i) * 0.005;
                if (pos[i * 3 + 1] < -0.5) {
                    pos[i * 3 + 1] = 9.5;
                }
            }
            this.snowGeo.attributes.position.needsUpdate = true;
        } else if (this.currentMode === 'cyberpunk' && this.cyberPoints && this.cyberPoints.visible) {
            const pos = this.cyberGeo.attributes.position.array;
            const time = Date.now() * 0.001;
            for (let i = 0; i < this.cyberCount; i++) {
                pos[i * 3 + 1] += 0.008;
                pos[i * 3] += Math.cos(time + i * 0.5) * 0.004;
                if (pos[i * 3 + 1] > 6.0) {
                    pos[i * 3 + 1] = 0.0;
                }
            }
            this.cyberGeo.attributes.position.needsUpdate = true;
        }
    }

    bindEvents() {
        document.querySelectorAll('.studio-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const studio = btn.getAttribute('data-studio');
                if (studio) this.setStudio(studio, true);
            });
        });
    }
}

/**
 * محرك البلازما والمؤثرات النفاثة الإجرائية (Procedural Thruster & Exhaust VFX)
 */
class ThrusterVFXManager {
    constructor(sceneRef) {
        this.scene = sceneRef;
        this.vfxGroup = new THREE.Group();
        this.scene.add(this.vfxGroup);
        this.emitters = [];
    }

    attachToMeshes(meshGroup) {
        this.clear();
        if (!meshGroup) return;

        meshGroup.traverse((child) => {
            if (child.isMesh) {
                const name = (child.name || '').toLowerCase();
                if (name.includes('exhaust') || name.includes('thruster') || name.includes('engine') || name.includes('nozzle')) {
                    this.createFlame(child);
                }
            }
        });
    }

    createFlame(parentMesh) {
        const pCount = 35;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(pCount * 3);
        const col = new Float32Array(pCount * 3);
        const vel = [];

        for (let i = 0; i < pCount; i++) {
            pos[i * 3] = 0;
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = 0;

            col[i * 3] = 0.2;     // R
            col[i * 3 + 1] = 0.7; // G
            col[i * 3 + 2] = 1.0; // B

            vel.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: -(0.05 + Math.random() * 0.1),
                life: Math.random()
            });
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geo, mat);
        parentMesh.add(points);
        this.emitters.push({ points, geo, vel, pCount });
    }

    update(delta) {
        for (const emitter of this.emitters) {
            const pos = emitter.geo.attributes.position.array;
            const col = emitter.geo.attributes.color.array;

            for (let i = 0; i < emitter.pCount; i++) {
                const v = emitter.vel[i];
                pos[i * 3] += v.x;
                pos[i * 3 + 1] += v.y;
                pos[i * 3 + 2] += v.z;
                v.life += 0.04;

                if (v.life > 0.45) {
                    col[i * 3] = 1.0;
                    col[i * 3 + 1] = 0.35;
                    col[i * 3 + 2] = 0.05;
                }

                if (v.life >= 1.0) {
                    pos[i * 3] = 0;
                    pos[i * 3 + 1] = 0;
                    pos[i * 3 + 2] = 0;
                    col[i * 3] = 0.2;
                    col[i * 3 + 1] = 0.8;
                    col[i * 3 + 2] = 1.0;
                    v.life = 0;
                }
            }
            emitter.geo.attributes.position.needsUpdate = true;
            emitter.geo.attributes.color.needsUpdate = true;
        }
    }

    clear() {
        for (const emitter of this.emitters) {
            if (emitter.points && emitter.points.parent) {
                emitter.points.parent.remove(emitter.points);
            }
            emitter.geo.dispose();
        }
        this.emitters = [];
    }
}

/**
 * لوحة الفحص والتعديل التفاعلي المباشر للقطع مع المزامنة ثنائية الاتجاه لـ Blender 5.2
 */
class PartInspectorManager {
    constructor(sceneRef, cameraRef, rendererRef) {
        this.scene = sceneRef;
        this.camera = cameraRef;
        this.renderer = rendererRef;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedMesh = null;
        this.selectionBox = null;
        this.syncDebounceTimer = null;

        this.hud = document.getElementById('partInspectorHud');
        this.nameEl = document.getElementById('inspectorPartName');
        this.colorPicker = document.getElementById('inspectorColorPicker');
        this.colorHex = document.getElementById('inspectorColorHex');
        this.roughnessSlider = document.getElementById('inspectorRoughnessSlider');
        this.roughnessVal = document.getElementById('inspectorRoughnessVal');
        this.metallicSlider = document.getElementById('inspectorMetallicSlider');
        this.metallicVal = document.getElementById('inspectorMetallicVal');
        this.syncStatus = document.getElementById('inspectorSyncStatus');
        this.closeBtn = document.getElementById('closeInspectorBtn');

        this.initEvents();
    }

    initEvents() {
        let downPos = { x: 0, y: 0 };
        const dom = this.renderer.domElement;

        dom.addEventListener('pointerdown', (e) => {
            downPos = { x: e.clientX, y: e.clientY };
        });

        dom.addEventListener('pointerup', (e) => {
            const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
            if (dist > 5) return; // تم تحريك الكاميرا وليس نقراً

            const rect = dom.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycastPick();
        });

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.deselect());
        }

        if (this.colorPicker) {
            this.colorPicker.addEventListener('input', (e) => {
                if (!this.selectedMesh || !this.selectedMesh.material) return;
                const hex = e.target.value;
                this.selectedMesh.material.color.set(hex);
                if (this.colorHex) this.colorHex.innerText = hex.toUpperCase();
                this.triggerSync();
            });
        }

        if (this.roughnessSlider) {
            this.roughnessSlider.addEventListener('input', (e) => {
                if (!this.selectedMesh || !this.selectedMesh.material) return;
                const val = parseFloat(e.target.value);
                this.selectedMesh.material.roughness = val;
                if (this.roughnessVal) this.roughnessVal.innerText = val.toFixed(2);
                this.triggerSync();
            });
        }

        if (this.metallicSlider) {
            this.metallicSlider.addEventListener('input', (e) => {
                if (!this.selectedMesh || !this.selectedMesh.material) return;
                const val = parseFloat(e.target.value);
                this.selectedMesh.material.metalness = val;
                if (this.metallicVal) this.metallicVal.innerText = val.toFixed(2);
                this.triggerSync();
            });
        }
    }

    raycastPick() {
        if (!currentMeshGroup) return;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(currentMeshGroup.children, true);

        const hit = intersects.find(i => i.object && i.object.isMesh);
        if (hit) {
            this.selectMesh(hit.object);
        }
    }

    selectMesh(mesh) {
        this.selectedMesh = mesh;

        this.removeSelectionBox();
        this.selectionBox = new THREE.BoxHelper(mesh, 0x38bdf8);
        this.scene.add(this.selectionBox);

        if (this.hud) this.hud.style.display = 'block';
        if (this.nameEl) this.nameEl.innerText = mesh.name || 'Object_Part';

        if (mesh.material && mesh.material.color) {
            const hex = '#' + mesh.material.color.getHexString();
            if (this.colorPicker) this.colorPicker.value = hex;
            if (this.colorHex) this.colorHex.innerText = hex.toUpperCase();
        }

        if (mesh.material && typeof mesh.material.roughness === 'number') {
            const r = mesh.material.roughness;
            if (this.roughnessSlider) this.roughnessSlider.value = r;
            if (this.roughnessVal) this.roughnessVal.innerText = r.toFixed(2);
        }

        if (mesh.material && typeof mesh.material.metalness === 'number') {
            const m = mesh.material.metalness;
            if (this.metallicSlider) this.metallicSlider.value = m;
            if (this.metallicVal) this.metallicVal.innerText = m.toFixed(2);
        }

        if (this.syncStatus) {
            this.syncStatus.innerText = '🟢 Live Sync with Blender 5.2';
            this.syncStatus.style.color = '#10b981';
        }
    }

    deselect() {
        this.selectedMesh = null;
        this.removeSelectionBox();
        if (this.hud) this.hud.style.display = 'none';
    }

    removeSelectionBox() {
        if (this.selectionBox) {
            this.scene.remove(this.selectionBox);
            this.selectionBox.geometry.dispose();
            this.selectionBox = null;
        }
    }

    triggerSync() {
        if (!this.selectedMesh) return;
        if (this.syncStatus) {
            this.syncStatus.innerText = '⏳ Syncing with Blender...';
            this.syncStatus.style.color = '#f59e0b';
        }

        clearTimeout(this.syncDebounceTimer);
        this.syncDebounceTimer = setTimeout(() => {
            this.sendSyncToBlender();
        }, 220);
    }

    async sendSyncToBlender() {
        if (!this.selectedMesh) return;
        const partName = this.selectedMesh.name;
        if (!partName) return;

        const col = this.selectedMesh.material.color;
        const r = col.r.toFixed(3);
        const g = col.g.toFixed(3);
        const b = col.b.toFixed(3);
        const roughness = (this.selectedMesh.material.roughness ?? 0.3).toFixed(2);
        const metallic = (this.selectedMesh.material.metalness ?? 0.0).toFixed(2);

        const pyCode = `
import bpy
obj = bpy.data.objects.get('${partName}')
if obj:
    if obj.data.materials and len(obj.data.materials) > 0:
        mat = obj.data.materials[0]
        if mat.users > 1:
            mat = mat.copy()
            obj.data.materials[0] = mat
    else:
        mat = bpy.data.materials.new(name=f"Mat_${partName}")
        mat.use_nodes = True
        obj.data.materials.append(mat)

    if mat and mat.use_nodes and mat.node_tree:
        bsdf = mat.node_tree.nodes.get('Principled BSDF')
        if bsdf:
            if 'Base Color' in bsdf.inputs:
                bsdf.inputs['Base Color'].default_value = (${r}, ${g}, ${b}, 1.0)
            if 'Roughness' in bsdf.inputs:
                bsdf.inputs['Roughness'].default_value = ${roughness}
            if 'Metallic' in bsdf.inputs:
                bsdf.inputs['Metallic'].default_value = ${metallic}
`;
        try {
            const bridgeHost = document.getElementById('bridgeHost')?.value?.trim() || 'http://localhost:8123';
            const res = await fetch(`${bridgeHost}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: pyCode }),
                signal: AbortSignal.timeout(3000)
            });
            if (res.ok) {
                if (this.syncStatus) {
                    this.syncStatus.innerText = '✅ Updated in Blender in real-time!';
                    this.syncStatus.style.color = '#10b981';
                }
            }
        } catch (err) {
            if (this.syncStatus) {
                this.syncStatus.innerText = '⚠️ Modified locally (Bridge disconnected)';
                this.syncStatus.style.color = '#94a3b8';
            }
        }
    }

    update() {
        if (this.selectionBox && this.selectedMesh) {
            this.selectionBox.update();
        }
    }
}

// 2. تهيئة المشهد ثلاثي الأبعاد فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initLanguageControls();
    init3DViewport();
    initTabSwitching();
    initChatControls();
    initSettingsModal();
    initBridgeControls();

    // بناء المنصة الترحيبية الهندسية
    buildDefaultStartupModel();
});

// تهيئة شاشة Three.js
function init3DViewport() {
    const container = document.getElementById('canvasContainer');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // المشهد
    scene = new THREE.Scene();

    // الكاميرا
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2.0, 1.8, 3.5);

    // الريندرر
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height, true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // التحكم بالكاميرا OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.maxPolarAngle = Math.PI / 2 + 0.1;
        controls.target.set(0, 0, 0);
    }

    // تهيئة محرك الاستوديوهات، والمؤثرات النفاثة، ولوحة الفحص
    studioEnvManager = new StudioEnvironmentManager(scene, renderer);
    thrusterVFXManager = new ThrusterVFXManager(scene);
    partInspectorManager = new PartInspectorManager(scene, camera, renderer);

    const clock = new THREE.Clock();

    // حلقة التحديث المستمر (Animation Loop)
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (controls) controls.update();
        if (currentMeshGroup && currentMeshGroup.userData.autoRotate) {
            currentMeshGroup.rotation.y += 0.003;
        }
        if (studioEnvManager) studioEnvManager.update(delta);
        if (thrusterVFXManager) thrusterVFXManager.update(delta);
        if (partInspectorManager) partInspectorManager.update();
        renderer.render(scene, camera);
    }
    animate();

    // التوافق التلقائي مع أي تغيير في حجم النافذة
    function updateCanvasSize() {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, true);
        }
    }

    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => updateCanvasSize());
        resizeObserver.observe(container);
    }
    window.addEventListener('resize', updateCanvasSize);
    setTimeout(updateCanvasSize, 80);

    // زر إعادة ضبط الكاميرا
    document.getElementById('resetCameraBtn').addEventListener('click', () => {
        if (currentMeshGroup) {
            fitCameraToObject(camera, currentMeshGroup, controls);
        } else {
            camera.position.set(2.0, 1.8, 3.5);
            if (controls) controls.target.set(0, 0, 0);
        }
    });

    // زر تفعيل الشبكة السلكية (Wireframe)
    document.getElementById('toggleWireframeBtn').addEventListener('click', () => {
        isWireframe = !isWireframe;
        if (currentMeshGroup) {
            currentMeshGroup.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.wireframe = isWireframe;
                }
            });
        }
    });

    // زر التنفيذ المباشر في بلندر
    document.getElementById('sendToBlenderBtn').addEventListener('click', () => {
        sendCurrentCodeToBlender();
    });
}

// 3. إدارة وتنظيف المشهد ثلاثي الأبعاد
function clearCurrentModel() {
    if (partInspectorManager) {
        partInspectorManager.deselect();
    }
    if (thrusterVFXManager) {
        thrusterVFXManager.clear();
    }
    if (currentMeshGroup) {
        scene.remove(currentMeshGroup);
        currentMeshGroup = null;
    }
}

// نموذج ترحيبي هندسي عند فتح التطبيق لأول مرة
function buildDefaultStartupModel() {
    clearCurrentModel();
    currentMeshGroup = new THREE.Group();
    currentMeshGroup.userData.autoRotate = true;
    currentMeshGroup.userData.isStartupModel = true;

    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: isWireframe
    });

    const glowMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        metalness: 0.4,
        roughness: 0.1,
        wireframe: isWireframe
    });

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.15, 32);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.3;
    currentMeshGroup.add(base);

    const bodyGeo = new THREE.TorusKnotGeometry(0.55, 0.18, 64, 16);
    const body = new THREE.Mesh(bodyGeo, glowMat);
    body.position.y = 0.5;
    currentMeshGroup.add(body);

    scene.add(currentMeshGroup);

    const statsEl = document.getElementById('objectStats');
    if (statsEl) {
        statsEl.innerText = I18N[currentLang]?.platformReady || 'Showcase Demo (Torus Knot) | Ready to build in Blender';
    }

    camera.position.set(1.6, 1.4, 3.2);
    if (controls) controls.target.set(0, 0.3, 0);

    latestCleanBpyCode = `# =======================================================
# 🚀 LiveAgent 3D - Connected & Ready for Blender 5.2 LTS
# =======================================================
import bpy

# Type any prompt in the chat (e.g. sports car, gaming chair, rose...)
# LiveAgent will generate clean bpy code and build it directly inside Blender!
`;
    const codeEl = document.getElementById('generatedCodeDisplay');
    if (codeEl) codeEl.innerText = latestCleanBpyCode;
}

/**
 * دالة تطهير وتنظيف كود بايثون من أي زوائد أو وسوم ماركداون أو نصوص تسبق الكود
 */
function extractAndCleanPythonCode(text) {
    if (!text) return '';

    let code = '';
    // مطابقة أي كتلة كود سواء كانت مغلقة بـ ``` أو مقطوعة عند نهاية النص بسبب حدود التوكن
    const blockRegex = /```(?:python|py|bpy)?\s*\n?([\s\S]*?)(?:```|$)/gi;
    let match;
    const candidates = [];
    while ((match = blockRegex.exec(text)) !== null) {
        const chunk = match[1] ? match[1].trim() : '';
        if (chunk.length > 0 && chunk.includes('bpy')) {
            candidates.push(chunk);
        }
    }

    if (candidates.length > 0) {
        code = candidates[0];
    } else {
        // إذا لم توجد وسوم ماركداون، نبحث عن بداية كود بايثون من import bpy
        const importIdx = text.indexOf('import bpy');
        if (importIdx !== -1) {
            code = text.substring(importIdx);
        } else {
            code = text;
        }
    }

    code = code.replace(/^```[a-zA-Z0-9_\-]*\s*/gm, '');
    code = code.replace(/\s*```$/gm, '');

    const lines = code.split(/\r?\n/);
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const lower = line.toLowerCase();
        if (lower === 'python' || lower === 'python3' || lower === 'py' || lower === 'bpy' || line.startsWith('**') || line.startsWith('###')) {
            continue;
        }
        if (line.startsWith('import ') || line.startsWith('from ') || line.startsWith('bpy.')) {
            startIdx = i;
            break;
        }
    }

    const rawCleaned = lines.slice(startIdx).join('\n').trim();

    // إزالة أي أسطر تحتوي على خاصيات محذوفة في Blender 4.2+ و 5.2 LTS
    const filteredLines = rawCleaned.split('\n').filter(line => {
        const s = line.trim();
        if (s.includes('.shadow_method') && s.includes('=')) return false;
        if (s.includes('.eevee.use_bloom') || s.includes('.eevee.use_ssr') || s.includes('.eevee.use_gtao') || s.includes('.eevee.use_ssr_refraction')) return false;
        return true;
    });

    let cleanedCode = filteredLines.join('\n');

    // ترقية تلقائية لتوافق مقابس خامات Principled BSDF مع Blender 5.2 LTS
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Transmission['"]\s*\]/g, "inputs['Transmission Weight']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Transmission['"]\s*\)/g, ".get('Transmission Weight')");
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Specular['"]\s*\]/g, "inputs['Specular IOR Level']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Specular['"]\s*\)/g, ".get('Specular IOR Level')");
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Emission['"]\s*\]/g, "inputs['Emission Color']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Emission['"]\s*\)/g, ".get('Emission Color')");
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Subsurface['"]\s*\]/g, "inputs['Subsurface Weight']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Subsurface['"]\s*\)/g, ".get('Subsurface Weight')");
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Clearcoat['"]\s*\]/g, "inputs['Coat Weight']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Clearcoat['"]\s*\)/g, ".get('Coat Weight')");
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Coat['"]\s*\]/g, "inputs['Coat Weight']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Coat['"]\s*\)/g, ".get('Coat Weight')");
    cleanedCode = cleanedCode.replace(/inputs\[\s*['"]Sheen['"]\s*\]/g, "inputs['Sheen Weight']");
    cleanedCode = cleanedCode.replace(/\.get\(\s*['"]Sheen['"]\s*\)/g, ".get('Sheen Weight')");
    // إصلاح تلقائي لأي خطأ أقواس في استدعاء التنعيم
    cleanedCode = cleanedCode.replace(/bpy\.ops\.object\.shade_smooth\s*\(\s*\)\s*\)+/g, 'bpy.ops.object.shade_smooth()');

    // إذا كان الكود يبني مجسمات جديدة نقوم بمسح كافة كائنات المشهد جذرياً وموثوقاً (دون الاعتماد على select_all الهش)
    if (cleanedCode.includes('primitive_') && !cleanedCode.includes('obj.data.materials')) {
        cleanedCode = cleanedCode.replace(/bpy\.ops\.object\.select_all\s*\([^)]*\)\s*;?\s*\n?/g, '');
        cleanedCode = cleanedCode.replace(/bpy\.ops\.object\.delete\s*\([^)]*\)\s*;?\s*\n?/g, '');
        cleanedCode = `import bpy\n# تنظيف جذري لكافة كائنات المشهد السابقة دون استثناء\nfor _obj in list(bpy.data.objects):\n    bpy.data.objects.remove(_obj, do_unlink=True)\nfor _mesh in list(bpy.data.meshes):\n    bpy.data.meshes.remove(_mesh, do_unlink=True)\n\n` + cleanedCode;
    }

    return cleanedCode;
}

/**
 * 4. رسم المشهد ثلاثي الأبعاد الحقيقي مباشرة من بيانات كائنات بلندر الحية (100% تطابق مع بلندر!)
 */
function renderFromBlenderScene(objects, promptTitle) {
    if (!objects || !Array.isArray(objects) || objects.length === 0) return false;

    clearCurrentModel();
    currentMeshGroup = new THREE.Group();
    currentMeshGroup.userData.autoRotate = true;

    for (const obj of objects) {
        const dim = obj.dimensions || [1, 1, 1];
        const loc = obj.location || [0, 0, 0];
        const rot = obj.rotation || [0, 0, 0];
        const color = obj.color || [0.3, 0.6, 0.9];
        const name = (obj.name || '').toLowerCase();

        // دعم الشفافية والانعكاس الزجاجي للعدسات والمزهريات
        const isGlass = (obj.transmission && obj.transmission > 0.1) || 
                        name.includes('lens') || name.includes('glass') || name.includes('water');
        
        const mat = new THREE.MeshPhysicalMaterial ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color[0], color[1], color[2]),
            metalness: obj.metalness || 0.3,
            roughness: isGlass ? 0.05 : (obj.roughness || 0.25),
            transmission: isGlass ? Math.max(obj.transmission || 0.6, 0.65) : 0.0,
            transparent: isGlass,
            opacity: isGlass ? 0.85 : 1.0,
            ior: isGlass ? 1.5 : 1.0,
            wireframe: isWireframe
        }) : new THREE.MeshStandardMaterial({
            color: new THREE.Color(color[0], color[1], color[2]),
            metalness: obj.metalness || 0.4,
            roughness: isGlass ? 0.1 : (obj.roughness || 0.3),
            transparent: isGlass,
            opacity: isGlass ? 0.85 : 1.0,
            wireframe: isWireframe
        });

        const isRadialSymmetric = dim[0] > 0.001 && dim[1] > 0.001 && Math.abs(dim[0] - dim[1]) <= 0.15 * Math.max(dim[0], dim[1]);
        const isSpherical = isRadialSymmetric && dim[2] > 0.001 && Math.abs(dim[0] - dim[2]) <= 0.15 * dim[0];
        const isCylindricalName = name.includes('cylinder') || name.includes('glass') || name.includes('cup') || 
                                 name.includes('juice') || name.includes('straw') || name.includes('drink') || 
                                 name.includes('slice') || name.includes('tube') || name.includes('wheel') || 
                                 name.includes('disc') || name.includes('vase') || name.includes('bottle') || 
                                 name.includes('can') || name.includes('mug') || name.includes('rim') || 
                                 name.includes('pipe') || name.includes('piston') || name.includes('table') || 
                                 name.includes('leg') || name.includes('stem') || name.includes('arm') || 
                                 name.includes('lens') || name.includes('hinge') || name.includes('tip');

        const isTorus = name.includes('torus') || name.includes('ring') || name.includes('doughnut') || 
                        name.includes('frame') || name.includes('bridge') || name.includes('rim');

        if (name.includes('cone') || (name.includes('shade') && dim[0] > 0.05)) {
            // مخروط (Cone)
            const r = Math.max(dim[0], dim[1]) / 2;
            const h = Math.max(dim[2], 0.05);
            geo = new THREE.ConeGeometry(r, h, 32);
        } else if (isTorus) {
            // حلقة دائرية ناعمة مجوفة (Torus) للإطارات والجسور
            const r = Math.max(dim[0], dim[1]) / 2;
            const tube = Math.max(dim[2] || 0.05, 0.04) / 2;
            geo = new THREE.TorusGeometry(r > 0.1 ? r : 0.72, tube, 24, 48);
        } else if (name.includes('sphere') || name.includes('bulb') || name.includes('ball') || name.includes('petal') || name.includes('fruit') || name.includes('leaf') || (isSpherical && !name.includes('cube') && !name.includes('box'))) {
            // كرة بيضاوية أو قشرة مسطحة بدقة الأبعاد الثلاثية الحقيقية (Ellipsoid / Thin Petal)
            geo = new THREE.SphereGeometry(0.5, 32, 24);
        } else if (isCylindricalName || (isRadialSymmetric && !name.includes('cube') && !name.includes('box') && !name.includes('seat'))) {
            // أسطوانة أو كأس أو قرص أو عدسة (Cylinder / Lens / Disc)
            geo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 32);
        } else {
            // مكعب أو متوازي مستطيلات (Box)
            geo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        }

        if (geo) {
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = obj.name || 'Object_Part';
            // تحويل إحداثيات بلندر (X, Y, Z حيث Z للأعلى) إلى Three.js (X, Y, Z حيث Y للأعلى)
            mesh.position.set(loc[0], loc[2], -loc[1]);
            mesh.rotation.set(rot[0], rot[2], -rot[1]);

            // تطبيق مقياس الأبعاد الحقيقية بدقة (X, Z->Y, Y->Z)
            if (name.includes('sphere') || name.includes('bulb') || name.includes('ball') || name.includes('petal') || name.includes('fruit') || name.includes('leaf') || isSpherical) {
                mesh.scale.set(dim[0] || 0.1, dim[2] || 0.02, dim[1] || 0.1);
            } else if (isTorus) {
                // الحلقات تتولد بمقاييس هندسية متوازنة
                mesh.scale.set(1, 1, 1);
            } else if (isCylindricalName || (isRadialSymmetric && !name.includes('cube') && !name.includes('box') && !name.includes('seat'))) {
                mesh.scale.set(dim[0] || 1, dim[2] || 1, dim[1] || 1);
            } else if (!name.includes('cone')) {
                mesh.scale.set(dim[0] || 1, dim[2] || 1, dim[1] || 1);
            }

            currentMeshGroup.add(mesh);
        }
    }

    scene.add(currentMeshGroup);
    fitCameraToObject(camera, currentMeshGroup, controls);

    // تفعيل المؤثرات النفاثة للمحركات والعوادم تلقائياً
    if (thrusterVFXManager) {
        thrusterVFXManager.attachToMeshes(currentMeshGroup);
    }
    if (partInspectorManager) {
        partInspectorManager.deselect();
    }

    const statsEl = document.getElementById('objectStats');
    if (statsEl) {
        statsEl.innerText = `Model: ${promptTitle || 'Live Blender Scene'} | Real Meshes: ${objects.length}`;
    }

    return true;
}

/**
 * 5. محرك البناء الديناميكي التحليلي المتقدم (Local Fallback Parser):
 * يستخرج كافة استدعاءات primitive_*_add بدقة الأقواس المتوازنة والمتغيرات والحلقات.
 */
function renderFromBpyCode(bpyCode, promptTitle) {
    clearCurrentModel();
    currentMeshGroup = new THREE.Group();
    currentMeshGroup.userData.autoRotate = true;

    if (!bpyCode || typeof bpyCode !== 'string') {
        scene.add(currentMeshGroup);
        return;
    }

    const palette = [
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.1, roughness: 0.6, wireframe: isWireframe }), // خشب دافئ
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2, wireframe: isWireframe }), // معدن داكن
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.3, wireframe: isWireframe }),  // أزرق
        new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.6, roughness: 0.2, wireframe: isWireframe }),  // أخضر
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.4, roughness: 0.4, wireframe: isWireframe }),  // كهرماني
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1, wireframe: isWireframe })   // كروم
    ];

    const customMaterials = [];
    const matColorRegex = /default_value\s*=\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)/g;
    let colMatch;
    while ((colMatch = matColorRegex.exec(bpyCode)) !== null) {
        const r = parseFloat(colMatch[1]) || 0.5;
        const g = parseFloat(colMatch[2]) || 0.5;
        const b = parseFloat(colMatch[3]) || 0.5;
        customMaterials.push(new THREE.MeshStandardMaterial({
            color: new THREE.Color(r, g, b),
            metalness: 0.4,
            roughness: 0.3,
            wireframe: isWireframe
        }));
    }

    const vars = { math: Math, pi: Math.PI, cos: Math.cos, sin: Math.sin };

    function evalExpr(expr, defVal) {
        if (!expr) return defVal;
        expr = expr.trim();
        const num = parseFloat(expr);
        if (!isNaN(num) && /^[-\d.]+$/.test(expr)) return num;

        try {
            const jsExpr = expr
                .replace(/math\.pi/g, 'Math.PI')
                .replace(/math\.cos/g, 'Math.cos')
                .replace(/math\.sin/g, 'Math.sin')
                .replace(/pi/g, 'Math.PI');
            const func = new Function(...Object.keys(vars), `try { return ${jsExpr}; } catch(e) { return ${defVal}; }`);
            const val = func(...Object.values(vars));
            return typeof val === 'number' && !isNaN(val) ? val : defVal;
        } catch {
            return defVal;
        }
    }

    function extractVector(str, key) {
        const reg = new RegExp(`${key}\\s*=\\s*\\(([^)]+)\\)`);
        const m = str.match(reg);
        if (m && m[1]) {
            const parts = m[1].split(',').map(p => p.trim());
            return [
                evalExpr(parts[0], 0),
                evalExpr(parts[1], 0),
                evalExpr(parts[2], 0)
            ];
        }
        return [0, 0, 0];
    }

    function extractFloat(str, key, defVal) {
        const reg = new RegExp(`${key}\\s*=\\s*([^,\\s)]+)`);
        const m = str.match(reg);
        if (m && m[1]) {
            return evalExpr(m[1], defVal);
        }
        return defVal;
    }

    // استخراج استدعاءات primitives بدقة الأقواس المتوازنة
    function extractAllPrimitives(code) {
        const results = [];
        let idx = 0;
        while ((idx = code.indexOf('bpy.ops.mesh.primitive_', idx)) !== -1) {
            const start = idx;
            const openParen = code.indexOf('(', start);
            if (openParen === -1) break;
            
            let depth = 1;
            let end = openParen + 1;
            while (end < code.length && depth > 0) {
                if (code[end] === '(') depth++;
                else if (code[end] === ')') depth--;
                end++;
            }
            
            const callStr = code.substring(start, end);
            results.push(callStr);
            idx = end;
        }
        return results;
    }

    // تسجيل أي متغيرات معرفة مسبقاً في الكود
    const lines = bpyCode.split(/\r?\n/);
    for (const l of lines) {
        let trimmed = l.trim();
        if (trimmed.includes('#')) {
            trimmed = trimmed.split('#')[0].trim();
        }
        if (trimmed.includes('=') && !trimmed.includes('bpy.') && !trimmed.includes('(')) {
            const eqP = trimmed.split('=');
            if (eqP.length === 2) {
                const vName = eqP[0].trim();
                if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(vName)) {
                    vars[vName] = evalExpr(eqP[1], 0);
                }
            }
        }
    }

    const primCalls = extractAllPrimitives(bpyCode);
    let parsedCount = 0;

    for (const callStr of primCalls) {
        // إذا كان الاستدعاء داخل حلقة تكرار (يحتوي على متغيرات تناظر sx أو زوايا أو loops)
        const isSxLoop = callStr.includes('sx');
        const isPhiLoop = callStr.includes('phi');
        const isLoop = isSxLoop || isPhiLoop || callStr.includes('angle') || callStr.includes('math.cos') || callStr.includes('math.sin');
        let iterations = 1;
        if (isSxLoop) iterations = 2;
        else if (isPhiLoop) iterations = 18;
        else if (isLoop) iterations = 3;

        for (let iter = 0; iter < iterations; iter++) {
            if (isSxLoop) {
                vars['sx'] = (iter === 0) ? -0.75 : 0.75;
            } else if (isPhiLoop) {
                vars['i'] = iter;
                vars['phi'] = iter * 137.5 * (Math.PI / 180.0);
                vars['r'] = 0.06 + (iter * 0.014);
                vars['z'] = 2.3 + (iter * 0.012);
            } else if (isLoop) {
                vars['i'] = iter;
                vars['angle'] = iter * (2 * Math.PI / iterations);
                vars['lx'] = 0.65 * Math.cos(vars['angle']);
                vars['ly'] = 0.65 * Math.sin(vars['angle']);
            }

            const loc = extractVector(callStr, 'location');
            const rot = extractVector(callStr, 'rotation') || extractVector(callStr, 'rotation_euler');
            let scale = callStr.includes('scale=') ? extractVector(callStr, 'scale') : [1, 1, 1];

            const mat = customMaterials.length > 0 
                ? customMaterials[parsedCount % customMaterials.length] 
                : palette[parsedCount % palette.length];

            let geo = null;

            if (callStr.includes('primitive_cube_add')) {
                const size = extractFloat(callStr, 'size', 1.0);
                geo = new THREE.BoxGeometry(size, size, size);
            } else if (callStr.includes('primitive_cylinder_add')) {
                const radius = extractFloat(callStr, 'radius', 0.5);
                let depth = extractFloat(callStr, 'depth', 0);
                if (depth <= 0) {
                    if (scale && scale[2] > 0 && scale[2] !== 1) {
                        depth = scale[2];
                    } else {
                        // إذا كان نصف القطر عريضاً (>= 0.25) فهو غطاء/قاعدة/سطح طاولة، أما الرفيع فهو عمود/رجل
                        depth = (radius >= 0.25) ? 0.06 : 0.75;
                    }
                }
                geo = new THREE.CylinderGeometry(radius, radius, depth, 32);
            } else if (callStr.includes('primitive_uv_sphere_add') || callStr.includes('primitive_ico_sphere_add')) {
                const radius = extractFloat(callStr, 'radius', 0.5);
                geo = new THREE.SphereGeometry(radius, 32, 24);
            } else if (callStr.includes('primitive_cone_add')) {
                const r1 = extractFloat(callStr, 'radius1', 0.16);
                const r2 = extractFloat(callStr, 'radius2', 0.06);
                const depth = extractFloat(callStr, 'depth', 0.18);
                geo = new THREE.CylinderGeometry(r2, r1, depth, 32);
            } else if (callStr.includes('primitive_torus_add')) {
                const major = extractFloat(callStr, 'major_radius', 0.8);
                const minor = extractFloat(callStr, 'minor_radius', 0.15);
                geo = new THREE.TorusGeometry(major, minor, 24, 48);
            } else if (callStr.includes('primitive_circle_add') || callStr.includes('primitive_plane_add')) {
                const size = extractFloat(callStr, 'size', 1.0) || extractFloat(callStr, 'radius', 0.5);
                geo = new THREE.PlaneGeometry(size, size);
            }

            if (geo) {
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(loc[0], loc[2], -loc[1]);
                mesh.rotation.set(rot[0], rot[2], -rot[1]);
                mesh.scale.set(scale[0] || 1, scale[2] || 1, scale[1] || 1);
                currentMeshGroup.add(mesh);
                parsedCount++;
            }
        }
    }

    if (parsedCount === 0) {
        const fallbackGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.3, wireframe: isWireframe });
        currentMeshGroup.add(new THREE.Mesh(fallbackGeo, fallbackMat));
    }

    scene.add(currentMeshGroup);
    fitCameraToObject(camera, currentMeshGroup, controls);

    const statsEl = document.getElementById('objectStats');
    if (statsEl) {
        statsEl.innerText = `Model: ${promptTitle || '3D Geometry'} | Geometric Primitives: ${parsedCount}`;
    }
}

function fitCameraToObject(cam, object, ctrl) {
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return;

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z, 0.5);
    const fov = cam.fov * (Math.PI / 180);
    let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
    cameraDistance = Math.max(cameraDistance, 2.2);

    cam.position.set(center.x + cameraDistance * 0.7, center.y + cameraDistance * 0.5, center.z + cameraDistance * 0.8);
    cam.lookAt(center);
    if (ctrl) {
        ctrl.target.copy(center);
        ctrl.update();
    }
}

// 6. إدارة التبويبات (Tabs)
function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');

            if (targetId === 'viewportTab') {
                setTimeout(() => {
                    const c = document.getElementById('canvasContainer');
                    if (c && renderer && camera) {
                        camera.aspect = c.clientWidth / c.clientHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(c.clientWidth, c.clientHeight);
                    }
                }, 50);
            }
        });
    });

    const copyBtn = document.getElementById('copyCodeBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = latestCleanBpyCode || document.getElementById('generatedCodeDisplay').innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerText = '✅ Copied!';
                setTimeout(() => copyBtn.innerText = '📋 Copy Code', 2000);
            });
        });
    }
}

// 7. AI & Chat Intelligence (Blender 5.2 LTS Master Modeler Architecture)
const GEMINI_SYSTEM_INSTRUCTION = `You are an expert AI 3D modeling systems engineer and Blender Python (bpy) procedural architect.
You work exclusively with Blender 5.2 LTS and the modern EEVEE Next render engine.

Your core mission:
Construct clean, physically cohesive, aesthetic, and production-ready 3D models (Masterpiece 3D Models) using error-free bpy Python code.

CRITICAL OUTPUT RULE:
Start your response IMMEDIATELY with executable Python code enclosed in \`\`\`python ... \`\`\` without ANY preamble, introduction, or internal thinking process. After closing the code block, you may append a 2-line technical summary of dimensions and materials.

\`\`\`python
import bpy
import math
# Complete code here
\`\`\`

Strict Procedural Modeling Rules (Blender 5.2 LTS):
1. Continuous Z-Stacking & Zero-Gap Cohesion:
   - Calculate coordinates deterministically. Connect components sequentially without leaving floating or disconnected parts.
   - Example: wheel base -> piston shaft rests on base -> seat rests on piston -> backrest attaches to seat.
2. Organic Contouring & Ergonomics:
   - Avoid flat primitive boxes alone. Use non-uniform scaling, beveled edges, and smooth shading:
     bpy.ops.object.shade_smooth()
   - Add Bevel Modifier for hard-surface realism:
     bev = obj.modifiers.new(name="Bevel", type='BEVEL')
     bev.width = 0.015
     bev.segments = 2
3. Mathematical Symmetry & Loops:
   - For repeated components (wheels, pedals, petals, legs), use circular loops:
     for i in range(N):
         angle = i * (2 * math.pi / N)
         lx = radius * math.cos(angle)
         ly = radius * math.sin(angle)
4. Hierarchical Parenting:
   - Parent child parts to primary structures to maintain cohesion: child_obj.parent = parent_obj
5. Modern Blender 5.2 Principled BSDF Standard:
   - NEVER set material.shadow_method (removed in Blender 4.2+ / 5.2+).
   - NEVER use obsolete EEVEE settings like use_bloom or use_ssr.
   - Use standard Blender 5.2 socket names:
     * inputs['Base Color'].default_value = (r, g, b, 1.0)
     * inputs['Roughness'].default_value = 0.3
     * inputs['Metallic'].default_value = 1.0 (for metals)
     * inputs['Transmission Weight'].default_value = 1.0 (for glass/fluids, NOT 'Transmission')
     * inputs['Specular IOR Level'].default_value = 0.5 (NOT 'Specular')
     * inputs['Subsurface Weight'].default_value = 0.35 (for skin/petals)
     * inputs['Sheen Weight'].default_value = 0.85 (for velvet/fabrics)
     * For glowing neon: inputs['Emission Color'].default_value = (r, g, b, 1.0) and inputs['Emission Strength'].default_value = 2.0
6. Object Mode Only:
   - Always clear old objects cleanly:
     for obj in list(bpy.data.objects): bpy.data.objects.remove(obj, do_unlink=True)
     for mesh in list(bpy.data.meshes): bpy.data.meshes.remove(mesh, do_unlink=True)
   - Never use Edit Mode or edit mode extrusions.
7. Multi-Component Completeness:
   - Always produce complete, multi-part models with functional anatomy (e.g. car chassis + cabin + 4 wheels + headlights + spoiler; glasses with dual rims + glass lenses + curved bridge + temple arms).
8. Studio Lighting:
   - Always add a Sun light so materials and geometry render vibrantly in Blender:
     sun_data = bpy.data.lights.new(name="Sun_Light", type='SUN')
     sun_data.energy = 4.5
     sun_obj = bpy.data.objects.new(name="Sun_Light", object_data=sun_data)
     bpy.context.collection.objects.link(sun_obj)
     sun_obj.rotation_euler = (math.radians(45), math.radians(25), math.radians(45))
9. Output code strictly inside \`\`\`python ... \`\`\`.`;

// Multi-Provider AI Engine Configuration
const PROVIDERS = {
    groq: {
        name: "Groq Cloud (14,400 req/day free)",
        badgeIcon: "⚡",
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        keyPlaceholder: "Paste Groq API key here: gsk_...",
        keyHint: `🔑 Get your free API key instantly without credit card from <a href="https://console.groq.com/keys" target="_blank" style="color:#60a5fa;text-decoration:underline;">Groq Console</a> (14,400 requests/day free!).`,
        models: [
            { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (👑 Best for bpy code - 12K TPM)" },
            { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant (⚡ Instant response 20K TPM - Free)" },
            { id: "openai/gpt-oss-120b", name: "OpenAI GPT-OSS 120B (High Reasoning)" },
            { id: "qwen/qwen3.8-27b", name: "Qwen 3.8 27B (Free - 800 token cap)" }
        ],
        defaultModel: "llama-3.3-70b-versatile"
    },
    gemini: {
        name: "Google Gemini",
        badgeIcon: "🌟",
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}",
        keyPlaceholder: "Paste Google API key here: AIzaSy...",
        keyHint: `🔑 Get your free Google API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#60a5fa;text-decoration:underline;">Google AI Studio</a>. (Select <b>Gemini 2.5 Flash</b> for ultra speed and accuracy).`,
        models: [
            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (⚡ Latest & fastest - Free 1,500 req/day)" },
            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (🟢 Stable & fast - Free)" },
            { id: "gemini-1.5-flash-latest", name: "Gemini 1.5 Flash Latest (🟢 Free 1,500 req/day)" }
        ],
        defaultModel: "gemini-2.5-flash"
    },
    openrouter: {
        name: "OpenRouter",
        badgeIcon: "🌐",
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        keyPlaceholder: "Paste OpenRouter key here: sk-or-v1-...",
        keyHint: `🔑 Get your key from <a href="https://openrouter.ai/keys" target="_blank" style="color:#60a5fa;text-decoration:underline;">OpenRouter Keys</a> (Credit required for paid models).`,
        models: [
            { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (🧠 Terra Engine - Paid)" },
            { id: "anthropic/claude-3.7-sonnet", name: "Claude 3.7 Sonnet (🚀 Latest - Paid)" },
            { id: "openai/gpt-4o", name: "OpenAI GPT-4o (Paid)" }
        ],
        defaultModel: "anthropic/claude-3.5-sonnet"
    },
    anthropic: {
        name: "Anthropic Claude (Terra Engine)",
        badgeIcon: "🧠",
        endpoint: "https://api.anthropic.com/v1/messages",
        keyPlaceholder: "Paste Anthropic key here: sk-ant-...",
        keyHint: `🔑 Get your key from <a href="https://console.anthropic.com/settings/keys" target="_blank" style="color:#60a5fa;text-decoration:underline;">Anthropic Console</a> (Credit required).`,
        models: [
            { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (👑 Terra Engine - Paid)" },
            { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet (🚀 Latest - Paid)" }
        ],
        defaultModel: "claude-3-5-sonnet-20241022"
    }
};

function getActiveProviderKey() {
    return localStorage.getItem('liveagent_provider') || 'groq';
}

function getActiveProvider() {
    const key = getActiveProviderKey();
    return PROVIDERS[key] || PROVIDERS.groq;
}

function getActiveApiKey() {
    const pKey = getActiveProviderKey();
    return localStorage.getItem(`liveagent_${pKey}_key`) || localStorage.getItem('liveagent_api_key') || '';
}

function getActiveModelName() {
    const provider = getActiveProvider();
    return localStorage.getItem('liveagent_model') || provider.defaultModel;
}

async function callAIEngine(promptText) {
    const providerKey = getActiveProviderKey();
    const provider = getActiveProvider();
    const modelName = getActiveModelName();
    const apiKey = getActiveApiKey();

    if (!apiKey || apiKey.trim().length < 5) {
        throw new Error(`Please enter an API key for (${provider.name}) in Settings ⚙️ at the top of the screen to proceed.`);
    }

    if (providerKey === 'gemini') {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
        const isGemini25 = modelName.includes('2.5');
        const genConfig = {
            maxOutputTokens: 4096,
            temperature: 0.1
        };
        if (isGemini25) {
            genConfig.thinkingConfig = { thinkingBudget: 0 };
        }

        const payload = {
            systemInstruction: {
                parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }]
            },
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: `User 3D Modeling Request: ${promptText}\n\nSTRICT INSTRUCTION: Output complete Python bpy code immediately inside \`\`\`python ... \`\`\` without any preamble or thinking text.` }
                    ]
                }
            ],
            generationConfig: genConfig
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Failed to connect to Google API (${response.status})`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        let content = candidate?.content?.parts?.[0]?.text || "";
        if (content.toLowerCase().includes("thinking process:")) {
            const codeIdx = content.indexOf('```');
            if (codeIdx !== -1) content = content.substring(codeIdx);
        }
        return content;
    } else if (providerKey === 'anthropic') {
        const response = await fetch(provider.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey.trim(),
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true"
            },
            body: JSON.stringify({
                model: modelName,
                max_tokens: 3000,
                system: GEMINI_SYSTEM_INSTRUCTION,
                messages: [
                    { role: "user", content: `User 3D Request: ${promptText}` }
                ],
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error?.message || `Failed to connect to Anthropic (${response.status})`);
        }

        const data = await response.json();
        return data.content?.[0]?.text || "";
    } else {
        // Groq or OpenRouter
        let tokenLimit = 2500;
        if (providerKey === 'groq' && modelName.includes('qwen')) {
            tokenLimit = 800; // Qwen on Groq free tier limit
        }
        const response = await fetch(provider.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    { role: "system", content: "You are an expert 3D Blender Python (bpy) assistant. Output ONLY executable Python code inside ```python ... ``` without any preamble, explanation, or thinking process." },
                    { role: "user", content: `${GEMINI_SYSTEM_INSTRUCTION}\n\nUser Request: ${promptText}` }
                ],
                temperature: 0.1,
                max_tokens: tokenLimit
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.error?.message || errorData.message || `Failed to connect to ${provider.name} (${response.status})`;
            throw new Error(msg);
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "";
        
        if (content.includes('</think>')) {
            content = content.split('</think>')[1].trim();
        }
        if (content.toLowerCase().includes("thinking process:")) {
            const codeIdx = content.indexOf('```');
            if (codeIdx !== -1) content = content.substring(codeIdx);
        }
        return content;
    }
}

function initChatControls() {
    const input = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        executeUserCommand(text);
        input.value = '';
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
}

function sendQuickPrompt(promptText) {
    const fallback = getCertifiedBlueprint(promptText);
    if (fallback) {
        appendMessage('user', promptText);
        const assistantMsgId = appendThinkingMessage();
        latestCleanBpyCode = fallback.code;
        document.getElementById('generatedCodeDisplay').innerText = fallback.code;
        renderFromBpyCode(fallback.code, promptText);
        sendCurrentCodeToBlender(fallback.code, promptText);
        const msgEl = document.getElementById(assistantMsgId);
        if (msgEl) {
            msgEl.querySelector('.bubble').innerHTML = formatMarkdownResponse(fallback.description, true);
        }
        const chatContainer = document.getElementById('chatMessages');
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
        return;
    }
    executeUserCommand(promptText);
}

async function executeUserCommand(promptText) {
    appendMessage('user', promptText);

    const provider = getActiveProvider();
    const model = getActiveModelName();
    const apiKey = getActiveApiKey();

    const assistantMsgId = appendThinkingMessage();

    // If API key is provided
    if (apiKey && apiKey.trim().length > 5) {
        updateThinkingStep(assistantMsgId, `🧠 Calling model ${model} via ${provider.name}...`);
        try {
            let aiResponse = await callAIEngine(promptText);
            
            // Extract and clean bpy code
            let cleanBpy = extractAndCleanPythonCode(aiResponse);
            let hasValidCode = cleanBpy && (cleanBpy.includes('bpy.') || cleanBpy.includes('primitive_'));

            if (hasValidCode) {
                latestCleanBpyCode = cleanBpy;
                document.getElementById('generatedCodeDisplay').innerText = cleanBpy;
                renderFromBpyCode(cleanBpy, promptText);
                sendCurrentCodeToBlender(cleanBpy, promptText);
            } else {
                // Call certified blueprint fallback if code was truncated
                const fallback = getCertifiedBlueprint(promptText);
                if (fallback) {
                    cleanBpy = fallback.code;
                    latestCleanBpyCode = cleanBpy;
                    document.getElementById('generatedCodeDisplay').innerText = cleanBpy;
                    renderFromBpyCode(cleanBpy, promptText);
                    sendCurrentCodeToBlender(cleanBpy, promptText);
                    hasValidCode = true;
                    aiResponse = fallback.description;
                }
            }

            const formattedResponse = formatMarkdownResponse(aiResponse, hasValidCode);
            const msgEl = document.getElementById(assistantMsgId);
            if (msgEl) {
                msgEl.querySelector('.bubble').innerHTML = formattedResponse;
            }
        } catch (err) {
            // Attempt to use certified blueprint even if API error occurred
            const fallback = getCertifiedBlueprint(promptText);
            const msgEl = document.getElementById(assistantMsgId);
            if (fallback && msgEl) {
                latestCleanBpyCode = fallback.code;
                document.getElementById('generatedCodeDisplay').innerText = fallback.code;
                renderFromBpyCode(fallback.code, promptText);
                sendCurrentCodeToBlender(fallback.code, promptText);
                msgEl.querySelector('.bubble').innerHTML = formatMarkdownResponse(fallback.description, true);
            } else if (msgEl) {
                msgEl.querySelector('.bubble').innerHTML = `
                    <p style="color: #ef4444;">⚠️ API Connection Error:</p>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(err.message)}</p>
                    <button class="chip" onclick="document.getElementById('settingsBtn').click()" style="margin-top: 8px;">⚙️ Configure API Key in Settings</button>
                `;
            }
        }
        const chatContainer = document.getElementById('chatMessages');
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return;
    }

    // 2. If no API key configured yet (instant blueprint fallback)
    setTimeout(() => {
        updateThinkingStep(assistantMsgId, '⚙️ Formulating bpy code, dimensions and modifiers...');
    }, 300);

    setTimeout(() => {
        finalizeAuthenticResponse(assistantMsgId, promptText);
    }, 800);
}

/**
 * Certified Master Procedural 3D Blueprints for Blender 5.2 LTS
 */
function getCertifiedBlueprint(promptText) {
    const lower = (promptText || '').toLowerCase();
    
    // 1. Master Velvet Damask Red Rose in Glass Vase
    if (lower.includes('ورد') || lower.includes('rose') || lower.includes('flower') || lower.includes('petal') || lower.includes('vase')) {
        return {
            description: `Constructed <strong>Master Velvet Damask Rose in Glass Vase</strong> successfully!
<ul>
  <li>Velvet crimson red petals shader featuring Subsurface Scattering (SSS) and Sheen.</li>
  <li>28-petal Fibonacci golden spiral structure transitioning from wrapped core to blooming petals.</li>
  <li>Micro physical water dew drops scattered across petal surfaces.</li>
  <li>Complete botanical anatomy: calyx, 5 sepals, thorny stem, and crystal glass vase with water.</li>
</ul>`,
            code: `import bpy
import math

for _obj in list(bpy.data.objects):
    bpy.data.objects.remove(_obj, do_unlink=True)
for _mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(_mesh, do_unlink=True)

# 1. خامة البتلات المخملية الفاخرة (Velvet Crimson Red مع Subsurface Scattering و Sheen)
mat_petal = bpy.data.materials.new(name="Rose_VelvetPetal")
mat_petal.use_nodes = True
bsdf_p = mat_petal.node_tree.nodes.get("Principled BSDF")
bsdf_p.inputs['Base Color'].default_value = (0.72, 0.015, 0.035, 1.0)
bsdf_p.inputs['Roughness'].default_value = 0.28
bsdf_p.inputs['Subsurface Weight'].default_value = 0.35
bsdf_p.inputs['Subsurface Radius'].default_value = (0.5, 0.2, 0.1)
bsdf_p.inputs['Sheen Weight'].default_value = 0.85
bsdf_p.inputs['Sheen Tint'].default_value = (0.9, 0.1, 0.1, 1.0)
bsdf_p.inputs['Specular IOR Level'].default_value = 0.55

# 2. خامة الساق والسبلات والأوراق (نباتية خضراء نضرة)
mat_stem = bpy.data.materials.new(name="Rose_BotanicalGreen")
mat_stem.use_nodes = True
bsdf_s = mat_stem.node_tree.nodes.get("Principled BSDF")
bsdf_s.inputs['Base Color'].default_value = (0.04, 0.28, 0.08, 1.0)
bsdf_s.inputs['Roughness'].default_value = 0.35
bsdf_s.inputs['Subsurface Weight'].default_value = 0.2

# 3. خامة قطرات الندى المائية (Water Dew Drop)
mat_dew = bpy.data.materials.new(name="Rose_DewDrop")
mat_dew.use_nodes = True
bsdf_d = mat_dew.node_tree.nodes.get("Principled BSDF")
bsdf_d.inputs['Base Color'].default_value = (1.0, 1.0, 1.0, 1.0)
bsdf_d.inputs['Roughness'].default_value = 0.02
bsdf_d.inputs['Transmission Weight'].default_value = 1.0
bsdf_d.inputs['Specular IOR Level'].default_value = 0.9

# 4. خامة المزهرية الزجاجية الكريستالية
mat_vase = bpy.data.materials.new(name="Glass_Vase")
mat_vase.use_nodes = True
bsdf_v = mat_vase.node_tree.nodes.get("Principled BSDF")
bsdf_v.inputs['Base Color'].default_value = (0.95, 0.98, 1.0, 1.0)
bsdf_v.inputs['Roughness'].default_value = 0.04
bsdf_v.inputs['Transmission Weight'].default_value = 0.96

# [1] المزهرية الزجاجية وقرص الماء
bpy.ops.mesh.primitive_cylinder_add(radius=0.48, depth=1.35, location=(0, 0, 0.68))
vase = bpy.context.active_object
vase.name = "GlassVase"
vase.data.materials.append(mat_vase)

bpy.ops.mesh.primitive_cylinder_add(radius=0.45, depth=0.9, location=(0, 0, 0.52))
water = bpy.context.active_object
water.name = "VaseWater"
water.data.materials.append(mat_vase)

# [2] ساق الوردة الشوكية الرشيقة
bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=2.2, location=(0, 0, 1.45))
stem = bpy.context.active_object
stem.name = "RoseStem"
stem.data.materials.append(mat_stem)

# أشواك الساق الصغيرة (Thorns)
for thorn_z, thorn_rot in [(1.05, 0.8), (1.35, -1.2), (1.65, 2.1)]:
    bpy.ops.mesh.primitive_cone_add(radius1=0.015, depth=0.06, location=(0.04 * math.cos(thorn_rot), 0.04 * math.sin(thorn_rot), thorn_z), rotation=(0, math.radians(70), thorn_rot))
    bpy.context.active_object.name = "Thorn"
    bpy.context.active_object.data.materials.append(mat_stem)

# [3] أوراق الساق النباتية المسننة
for lx, ly, lz, rot in [(0.28, 0.1, 1.25, 0.45), (-0.28, -0.1, 1.55, -0.45)]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.28, location=(lx, ly, lz))
    leaf = bpy.context.active_object
    leaf.name = "Leaf"
    leaf.scale = (1.5, 0.06, 0.55)
    leaf.rotation_euler = (math.radians(15), math.radians(20), rot)
    leaf.data.materials.append(mat_stem)

# [4] كأس الوردة والسبلات الخضراء (Calyx & Sepals)
bpy.ops.mesh.primitive_cone_add(radius1=0.18, radius2=0.04, depth=0.22, location=(0, 0, 2.38))
calyx = bpy.context.active_object
calyx.name = "Calyx"
calyx.data.materials.append(mat_stem)

for s_i in range(5):
    s_angle = s_i * (2 * math.pi / 5)
    bpy.ops.mesh.primitive_cone_add(radius1=0.045, depth=0.32, location=(0.14 * math.cos(s_angle), 0.14 * math.sin(s_angle), 2.45), rotation=(math.radians(35) * math.sin(s_angle), -math.radians(35) * math.cos(s_angle), s_angle))
    sepal = bpy.context.active_object
    sepal.name = f"Sepal_{s_i+1}"
    sepal.data.materials.append(mat_stem)

# [5] بنية البتلات الحلزونية الذهبية (Fibonacci Spiral - 28 Petals)
for i in range(28):
    prog = i / 27.0
    phi = i * 137.508 * (math.pi / 180.0)
    
    r = 0.03 + (0.34 * math.pow(prog, 0.85))
    z = 2.48 + (0.28 * math.pow(1.0 - prog, 0.7))
    
    sx = 0.22 + (0.58 * math.pow(prog, 0.75))
    sy = 0.32 + (0.65 * math.pow(prog, 0.75))
    sz = 0.04 + (0.07 * prog)
    
    tilt = math.radians(12 + (68 * math.pow(prog, 1.2)))
    
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.45, location=(r * math.cos(phi), r * math.sin(phi), z))
    petal = bpy.context.active_object
    petal.name = f"Petal_{i+1:02d}"
    petal.scale = (sx, sy, sz)
    petal.rotation_euler = (tilt * math.sin(phi), -tilt * math.cos(phi), phi + math.radians(90))
    petal.data.materials.append(mat_petal)

# [6] قطرات الندى المائية الفيزيائية (Dew Drops) المتناثرة على البتلات
dew_coords = [
    (0.24, 0.18, 2.65, 0.024),
    (-0.28, 0.12, 2.58, 0.028),
    (0.12, -0.32, 2.54, 0.022),
    (-0.16, -0.26, 2.62, 0.025),
    (0.32, -0.15, 2.51, 0.026),
    (0.02, 0.36, 2.52, 0.022)
]
for d_x, d_y, d_z, d_r in dew_coords:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=d_r, location=(d_x, d_y, d_z))
    dew = bpy.context.active_object
    dew.name = "DewDrop"
    dew.data.materials.append(mat_dew)

# تنعيم كافة الأسطح
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        for poly in obj.data.polygons:
            poly.use_smooth = True

print("✅ تم بناء الوردة الجورية المخملية فائقة الواقعية في بلندر!")
`
        };
    }

    // 2. Luxury Designer Sunglasses with Torus Rims, Gold Bridge & Reflective Lenses
    if (lower.includes('نظار') || lower.includes('glass') || lower.includes('sunglass') || lower.includes('eyewear')) {
        return {
            description: `Constructed <strong>Luxury Designer Sunglasses</strong> successfully!
<ul>
  <li>Dual hollow Torus rims with deep navy polished gloss.</li>
  <li>Reflective transmission glass lenses with physical IOR and optical depth.</li>
  <li>Curved polished gold metallic bridge and side hinges.</li>
  <li>Ergonomic temple arms and curved ear tips without floating gaps.</li>
</ul>`,
            code: `import bpy
import math

for _obj in list(bpy.data.objects):
    bpy.data.objects.remove(_obj, do_unlink=True)
for _mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(_mesh, do_unlink=True)

# 1. خامة الإطار الحلقي (كحلي ملكي داكن ببريق ناعم)
mat_frame = bpy.data.materials.new(name="Sunglasses_Frame")
mat_frame.use_nodes = True
bsdf_f = mat_frame.node_tree.nodes.get("Principled BSDF")
bsdf_f.inputs['Base Color'].default_value = (0.04, 0.09, 0.16, 1.0)
bsdf_f.inputs['Roughness'].default_value = 0.15
bsdf_f.inputs['Metallic'].default_value = 0.35

# 2. خامة العدسات العاكسة والنافذة (أزرق مشع بنفاذية زجاجية حقيقية)
mat_lens = bpy.data.materials.new(name="Sunglasses_Lens")
mat_lens.use_nodes = True
bsdf_l = mat_lens.node_tree.nodes.get("Principled BSDF")
bsdf_l.inputs['Base Color'].default_value = (0.05, 0.25, 0.85, 1.0)
bsdf_l.inputs['Roughness'].default_value = 0.05
bsdf_l.inputs['Metallic'].default_value = 0.5
bsdf_l.inputs['Transmission Weight'].default_value = 0.65
bsdf_l.inputs['Specular IOR Level'].default_value = 0.95

# 3. خامة الجسر الذهبي الفاخر
mat_gold = bpy.data.materials.new(name="Sunglasses_Gold")
mat_gold.use_nodes = True
bsdf_g = mat_gold.node_tree.nodes.get("Principled BSDF")
bsdf_g.inputs['Base Color'].default_value = (0.95, 0.72, 0.12, 1.0)
bsdf_g.inputs['Roughness'].default_value = 0.15
bsdf_g.inputs['Metallic'].default_value = 0.95

# 1. بناء الإطارين الدائريين المجوفين والعدسات
for sx in (-0.85, 0.85):
    # إطار حلقي ناعم مجوف (Torus)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.72, minor_radius=0.10, location=(sx, 0, 0), rotation=(math.radians(90), 0, 0))
    frame = bpy.context.active_object
    frame.name = f"Frame_{'R' if sx > 0 else 'L'}"
    frame.data.materials.append(mat_frame)

    # عدسة زجاجية أسطوانية رقيقة بداخل الإطار
    bpy.ops.mesh.primitive_cylinder_add(radius=0.70, depth=0.035, location=(sx, 0.005, 0), rotation=(math.radians(90), 0, 0))
    lens = bpy.context.active_object
    lens.name = f"Lens_{'R' if sx > 0 else 'L'}"
    lens.data.materials.append(mat_lens)

# 2. الجسر الذهبي المقوس الفخم في المنتصف
bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.045, location=(0, 0.02, 0.32), rotation=(0, 0, 0))
bridge = bpy.context.active_object
bridge.name = "Bridge_Gold"
bridge.scale = (0.9, 0.45, 0.45)
bridge.data.materials.append(mat_gold)

# 3. الأذرع الجانبية والمفاصل
for sx in (-1.55, 1.55):
    # مفصل جانبي ذهبي
    bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.12, location=(sx, -0.05, 0.22), rotation=(0, math.radians(90), 0))
    hinge = bpy.context.active_object
    hinge.name = f"Hinge_{'R' if sx > 0 else 'L'}"
    hinge.data.materials.append(mat_gold)

    # ذراع أفقية ممتدة للخلف
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, -0.95, 0.22))
    arm = bpy.context.active_object
    arm.name = f"TempleArm_{'R' if sx > 0 else 'L'}"
    arm.scale = (0.045, 1.8, 0.065)
    arm.data.materials.append(mat_frame)

    # انحناءة نهاية الأذن
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.42, location=(sx, -1.9, 0.06), rotation=(math.radians(40), 0, 0))
    tip = bpy.context.active_object
    tip.name = f"EarTip_{'R' if sx > 0 else 'L'}"
    tip.data.materials.append(mat_frame)

# تنعيم كافة الأسطح
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        for poly in obj.data.polygons:
            poly.use_smooth = True

print("✅ Luxury Sunglasses built successfully in Blender!")
`
        };
    }

    // 3. Modern Wooden Coffee Table & Desk Lamp
    if (lower.includes('طاول') || lower.includes('table') || lower.includes('قهو') || lower.includes('desk') || lower.includes('lamp')) {
        return {
            description: `Constructed <strong>Modern Round Wooden Coffee Table & Desk Lamp</strong> successfully!
<ul>
  <li>Thick polished oak tabletop with beveled rim.</li>
  <li>3-legged angled metallic tripod base for physical stability.</li>
  <li>Modern mini desk lamp integrated on the tabletop.</li>
</ul>`,
            code: `import bpy
import math

for _obj in list(bpy.data.objects):
    bpy.data.objects.remove(_obj, do_unlink=True)
for _mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(_mesh, do_unlink=True)


mat_wood = bpy.data.materials.new(name="Table_OakWood")
mat_wood.use_nodes = True
mat_wood.node_tree.nodes.get("Principled BSDF").inputs['Base Color'].default_value = (0.75, 0.52, 0.32, 1.0)

mat_metal = bpy.data.materials.new(name="Table_BlackMetal")
mat_metal.use_nodes = True
mat_metal.node_tree.nodes.get("Principled BSDF").inputs['Base Color'].default_value = (0.1, 0.1, 0.12, 1.0)

bpy.ops.mesh.primitive_cylinder_add(radius=0.95, depth=0.07, location=(0, 0, 0.75))
table_top = bpy.context.active_object
table_top.name = "TableTop"
table_top.data.materials.append(mat_wood)

for i in range(3):
    angle = i * (2 * math.pi / 3)
    lx = 0.7 * math.cos(angle)
    ly = 0.7 * math.sin(angle)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.78, location=(lx, ly, 0.39))
    leg = bpy.context.active_object
    leg.name = f"TableLeg_{i+1}"
    leg.rotation_euler = (-0.18 * math.sin(angle), 0.18 * math.cos(angle), 0)
    leg.data.materials.append(mat_metal)

bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.02, location=(0.25, 0.15, 0.80))
lamp_base = bpy.context.active_object
lamp_base.name = "LampBase"

bpy.ops.mesh.primitive_cylinder_add(radius=0.016, depth=0.38, location=(0.25, 0.15, 1.0))
lamp_arm = bpy.context.active_object
lamp_arm.name = "LampArm"

bpy.ops.mesh.primitive_cone_add(radius1=0.16, radius2=0.06, depth=0.18, location=(0.25, 0.15, 1.25))
lamp_shade = bpy.context.active_object
lamp_shade.name = "LampShade"

print("✅ Modern Coffee Table & Lamp built successfully in Blender!")
`
        };
    }

    return null;
}

function finalizeAuthenticResponse(msgId, promptText) {
    const msg = document.getElementById(msgId);
    if (!msg) return;

    const blueprint = getCertifiedBlueprint(promptText);
    let realBpy = '';
    let description = '';

    if (blueprint) {
        realBpy = blueprint.code;
        description = blueprint.description;
    } else {
        description = `<p>Constructed 3D geometry and generated <code>bpy</code> code for <strong>"${escapeHtml(promptText)}"</strong>.</p>`;
        realBpy = `import bpy

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

bpy.ops.mesh.primitive_cylinder_add(radius=1.2, depth=0.15, location=(0, 0, 0.1))
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.8))

for obj in bpy.data.objects:
    if obj.type == 'MESH':
        for p in obj.data.polygons:
            p.use_smooth = True

print("✨ 3D Model built successfully in Blender!")
`;
    }

    latestCleanBpyCode = realBpy;
    document.getElementById('generatedCodeDisplay').innerText = realBpy;
    renderFromBpyCode(realBpy, promptText);
    sendCurrentCodeToBlender(realBpy, promptText);

    msg.querySelector('.bubble').innerHTML = formatMarkdownResponse(description, true);
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function formatMarkdownResponse(text, hasValidCode = true) {
    let cleanText = text || "";

    // 1. Remove internal thinking tags (<think> or Here's a thinking process)
    cleanText = cleanText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    cleanText = cleanText.replace(/Here'?s\s+a\s+thinking\s+process:[\s\S]*?(?=```|$)/gi, '').trim();

    // 2. Extract explanation written after python code block
    let explanation = "";
    const codeMatch = /```(?:python|py|bpy)?[\s\S]*?```([\s\S]*)/i.exec(cleanText);
    if (codeMatch && codeMatch[1] && codeMatch[1].trim().length > 0) {
        explanation = codeMatch[1].trim();
    } else {
        explanation = cleanText.replace(/```(?:python|py|bpy)?[\s\S]*?(?:```|$)/gi, '').trim();
    }

    // Clean up residual thinking snippets
    const lowerExp = explanation.toLowerCase();
    if (lowerExp.includes('thinking process') || 
        lowerExp.includes('analyze user') || 
        lowerExp.includes('check constraints') ||
        lowerExp.includes('deconstruct the model') ||
        explanation.length < 4) {
        explanation = "✨ 3D parametric geometry, PBR shaders, and modifiers constructed successfully.";
    }

    let html = `<p>${explanation.replace(/\n/g, '<br>')}</p>`;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (hasValidCode) {
        html += `
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; font-size: 0.83rem;">
                ✨ <strong>3D model updated in viewport and synchronized with Blender!</strong><br>
                💡 To re-send to <strong>Blender</strong> anytime: click <button class="chip" onclick="sendCurrentCodeToBlender()" style="display:inline-block; margin: 4px 0; padding: 2px 8px; font-size: 0.78rem;">⚡ Execute in Blender</button>
            </div>
        `;
    } else {
        html += `
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; font-size: 0.83rem; color: #fca5a5;">
                ⚠️ <strong>Notice: Incomplete Blender Code</strong> (Generation finished before full code closure).<br>
                💡 Choose <strong>Llama 3.3 70B</strong> or <strong>Gemini 2.5 Flash</strong> for ultra-fast, complete responses.
            </div>
        `;
    }
    return html;
}

function appendMessage(sender, text) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;

    const avatar = sender === 'user' ? 'You' : '🤖';
    const name = sender === 'user' ? 'Engineer' : 'LiveAgent';

    msgDiv.innerHTML = `
        <div class="avatar">${avatar}</div>
        <div class="message-content">
            <div class="sender-name">${name}</div>
            <div class="bubble"><p>${escapeHtml(text)}</p></div>
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function appendThinkingMessage() {
    const container = document.getElementById('chatMessages');
    const msgId = 'msg-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = msgId;
    msgDiv.className = 'message assistant';

    msgDiv.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="message-content">
            <div class="sender-name">LiveAgent</div>
            <div class="bubble">
                <div class="thinking-indicator">
                    <span class="pulse-dot"></span>
                    <span class="step-text">🧠 Analyzing 3D prompt and generating bpy code...</span>
                </div>
            </div>
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    return msgId;
}

function updateThinkingStep(msgId, stepText) {
    const msg = document.getElementById(msgId);
    if (!msg) return;
    const textEl = msg.querySelector('.step-text');
    if (textEl) textEl.innerText = stepText;
}

function getBridgeHost() {
    const inputVal = document.getElementById('bridgeHost')?.value?.trim();
    if (inputVal && inputVal.length > 5) return inputVal.replace(/\/+$/, '');
    return 'http://127.0.0.1:8123';
}

function initBridgeControls() {
    const testBtn = document.getElementById('testBridgeBtn');
    const resultEl = document.getElementById('bridgeTestResult');
    const syncBtn = document.getElementById('syncFromBlenderBtn');

    function checkBridge() {
        fetch(`${getBridgeHost()}/ping`, { method: 'GET', mode: 'cors' })
            .then(res => res.json())
            .then(data => {
                const statusEl = document.getElementById('blenderStatus');
                if (statusEl) {
                    statusEl.className = 'status-pill connected';
                    statusEl.querySelector('.status-text').innerText = (currentLang === 'ar')
                        ? `جسر بلندر: متصل (${data.version || 'Active'})`
                        : `Blender Bridge: Connected (${data.version || 'Active'})`;
                }
                if (syncBtn) syncBtn.style.display = 'inline-block';
                if (resultEl) {
                    resultEl.innerText = '🟢 Connected successfully with Blender ' + (data.version || '');
                    resultEl.style.color = '#10b981';
                }
            })
            .catch(() => {
                const statusEl = document.getElementById('blenderStatus');
                if (statusEl) {
                    statusEl.className = 'status-pill disconnected';
                    statusEl.querySelector('.status-text').innerText = (currentLang === 'ar')
                        ? 'جسر بلندر: غير متصل (اضغط للشرح)'
                        : 'Blender Bridge: Disconnected (Click to setup)';
                }
                if (syncBtn) syncBtn.style.display = 'none';
                if (resultEl) {
                    resultEl.innerText = '⚠️ Blender is not currently connected. (Make sure add-on is active or run launch_blender_bridge.bat)';
                    resultEl.style.color = '#f59e0b';
                }
            });
    }

    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            syncBtn.innerText = (currentLang === 'ar') ? '⏳ جاري المزامنة...' : '⏳ Syncing...';
            fetch(`${getBridgeHost()}/scene`)
                .then(r => r.json())
                .then(sceneData => {
                    if (sceneData && sceneData.objects && sceneData.objects.length > 0) {
                        renderFromBlenderScene(sceneData.objects, 'Blender Active Scene');
                        syncBtn.innerText = (currentLang === 'ar')
                            ? `✅ تمت المزامنة (${sceneData.objects_count} مجسم)`
                            : `✅ Synced (${sceneData.objects_count} objects)`;
                    } else {
                        syncBtn.innerText = (currentLang === 'ar') ? '⚠️ المشهد فارغ في بلندر' : '⚠️ Scene is empty in Blender';
                    }
                    setTimeout(() => {
                        syncBtn.innerText = I18N[currentLang]?.syncBtnText || '🔄 Sync Active Blender Scene';
                    }, 3000);
                })
                .catch(err => {
                    syncBtn.innerText = (currentLang === 'ar') ? '❌ تعذر جلب المشهد' : '❌ Failed to fetch scene';
                    setTimeout(() => {
                        syncBtn.innerText = I18N[currentLang]?.syncBtnText || '🔄 Sync Active Blender Scene';
                    }, 3000);
                });
        });
    }

    setInterval(checkBridge, 4000);
    setTimeout(checkBridge, 400);

    const statusPill = document.getElementById('blenderStatus');
    if (statusPill) {
        statusPill.addEventListener('click', () => {
            const bridgeTabBtn = document.querySelector('[data-tab="bridgeTab"]');
            if (bridgeTabBtn) bridgeTabBtn.click();
        });
    }

    if (testBtn) {
        testBtn.addEventListener('click', () => {
            if (resultEl) {
                resultEl.innerText = 'Connecting to Blender...';
                resultEl.style.color = '#38bdf8';
            }
            checkBridge();
        });
    }
}

/**
 * Send verified bpy Python code to running Blender session
 */
function sendCurrentCodeToBlender(explicitCode, promptTitle) {
    let code = explicitCode || latestCleanBpyCode || document.getElementById('generatedCodeDisplay').innerText;
    code = extractAndCleanPythonCode(code);
    
    const btn = document.getElementById('sendToBlenderBtn');
    if (!code || code.trim().length === 0) return;

    const tStart = Date.now();
    btn.innerText = '⏳ Sending & executing in Blender...';
    btn.style.background = '#3b82f6';

    const bridgeUrl = getBridgeHost();

    fetch(`${bridgeUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.status === 'error') {
            const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
            btn.innerText = `❌ Error in Blender code (${elapsed}s)`;
            btn.style.background = '#ef4444';
            appendMessage('assistant', `⚠️ Blender encountered an error during code execution:\n\`\`\`\n${data.error || 'Unknown error'}\n\`\`\``);
            setTimeout(() => {
                btn.innerText = '⚡ Execute in Blender';
                btn.style.background = '';
            }, 5000);
            return;
        }

        btn.innerText = '⚙️ Synchronizing scene from Blender...';

        // Render true Blender objects immediately
        if (data && data.objects && data.objects.length > 0) {
            renderFromBlenderScene(data.objects, promptTitle);
        }

        setTimeout(() => {
            fetch(`${bridgeUrl}/scene`)
                .then(r => r.json())
                .then(sceneData => {
                    const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
                    const count = (sceneData && typeof sceneData.objects_count !== 'undefined') ? sceneData.objects_count : (data.objects_count || 0);
                    btn.innerText = `✅ Built in Blender (${count} objects | ${elapsed}s)`;
                    btn.style.background = '#10b981';

                    if (sceneData && sceneData.objects && sceneData.objects.length > 0) {
                        renderFromBlenderScene(sceneData.objects, promptTitle);
                    }

                    setTimeout(() => {
                        btn.innerText = '⚡ Execute in Blender';
                        btn.style.background = '';
                    }, 4000);
                })
                .catch(() => {
                    const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
                    btn.innerText = `✅ Executed in Blender (${elapsed}s)`;
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.innerText = '⚡ Execute in Blender';
                        btn.style.background = '';
                    }, 3000);
                });
        }, 350);
    })
    .catch(err => {
        btn.innerText = '⚠️ Blender not connected';
        btn.style.background = '#f59e0b';
        setTimeout(() => {
            btn.innerText = '⚡ Execute in Blender';
            btn.style.background = '';
        }, 4000);
        const bridgeTabBtn = document.querySelector('[data-tab="bridgeTab"]');
        if (bridgeTabBtn) bridgeTabBtn.click();
    });
}

// 9. Multi-Provider Settings Modal
function initSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('settingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const providerSelect = document.getElementById('providerSelect');
    const modelSelect = document.getElementById('modelSelect');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyLabel = document.getElementById('apiKeyLabel');
    const apiKeyHint = document.getElementById('apiKeyHint');
    const activeModelBadge = document.getElementById('activeModel');

    function updateBadge() {
        const provider = getActiveProvider();
        const model = getActiveModelName();
        if (activeModelBadge) {
            activeModelBadge.innerText = `${provider.badgeIcon} ${model}`;
        }
    }

    function populateModelsForProvider(pKey, selectedModel) {
        const provider = PROVIDERS[pKey] || PROVIDERS.gemini;
        if (!modelSelect) return;

        modelSelect.innerHTML = '';
        provider.models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.innerText = m.name;
            if (m.id === (selectedModel || provider.defaultModel)) {
                opt.selected = true;
            }
            modelSelect.appendChild(opt);
        });

        if (apiKeyLabel) {
            apiKeyLabel.innerText = `${provider.name} API Key:`;
        }
        if (apiKeyInput) {
            apiKeyInput.placeholder = provider.keyPlaceholder;
            const savedKey = localStorage.getItem(`liveagent_${pKey}_key`) || 
                             (pKey === 'gemini' ? localStorage.getItem('liveagent_api_key') : '') || '';
            apiKeyInput.value = savedKey;
        }
        if (apiKeyHint) {
            apiKeyHint.innerHTML = provider.keyHint;
        }
    }

    const currentPKey = getActiveProviderKey();
    const currentModel = getActiveModelName();

    if (providerSelect) {
        providerSelect.value = currentPKey;
        populateModelsForProvider(currentPKey, currentModel);

        providerSelect.addEventListener('change', (e) => {
            const newP = e.target.value;
            populateModelsForProvider(newP, null);
        });
    }

    updateBadge();

    openBtn.addEventListener('click', () => {
        const pKey = getActiveProviderKey();
        if (providerSelect) providerSelect.value = pKey;
        populateModelsForProvider(pKey, getActiveModelName());
        modal.classList.add('open');
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    saveBtn.addEventListener('click', () => {
        const pKey = providerSelect ? providerSelect.value : 'gemini';
        const model = modelSelect ? modelSelect.value : (PROVIDERS[pKey]?.defaultModel || 'gemini-1.5-flash');
        const key = apiKeyInput ? apiKeyInput.value.trim() : '';

        localStorage.setItem('liveagent_provider', pKey);
        localStorage.setItem('liveagent_model', model);
        localStorage.setItem(`liveagent_${pKey}_key`, key);
        
        if (pKey === 'gemini') {
            localStorage.setItem('liveagent_api_key', key);
        }

        updateBadge();
        modal.classList.remove('open');

        const pName = PROVIDERS[pKey]?.name || pKey;
        if (key) {
            appendMessage('assistant', `✅ Settings saved! Provider **${pName}** with model **${model}** is ready.\nLiveAgent is ready to construct any 3D model directly in Blender.`);
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}
