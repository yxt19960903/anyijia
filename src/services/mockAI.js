function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSVGDataURL(width, height, bgColor, textColor, lines) {
  const lineHeight = 32;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const textElements = lines.map((line, i) =>
    `<text x="${width / 2}" y="${startY + i * lineHeight}" text-anchor="middle" font-family="sans-serif" font-size="${line.size || 24}" fill="${textColor}" font-weight="${line.weight || 'bold'}">${line.text}</text>`
  ).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="8" fill="none" stroke="${textColor}" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="8 4"/>
    ${textElements}
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const styleConfigs = {
  'warm-wood': { bg: '#C4A882', text: '#5C4A32', label: '原木温馨' },
  scandinavian: { bg: '#D4C4A8', text: '#5C4A32', label: '北欧适老' },
  chinese: { bg: '#8B7355', text: '#FFFFFF', label: '中式雅居' },
  japanese: { bg: '#BE9B6F', text: '#5C4A32', label: '日式和风' },
  modern: { bg: '#A0845C', text: '#FFFFFF', label: '现代适老' },
  minimalist: { bg: '#E8DDD0', text: '#5C4A32', label: '极简安全' },
  luxury: { bg: '#D4A574', text: '#FFFFFF', label: '轻奢养老' },
  mediterranean: { bg: '#B8C4D4', text: '#5C4A32', label: '地中海风' },
  pastoral: { bg: '#A8C4A0', text: '#5C4A32', label: '田园牧歌' },
  artdeco: { bg: '#C0B090', text: '#5C4A32', label: '装饰艺术' },
  tropical: { bg: '#8BB070', text: '#5C4A32', label: '热带风情' },
  'wabi-sabi': { bg: '#B8A890', text: '#5C4A32', label: '侘寂之美' },
};

function getStyleImage(style) {
  const config = styleConfigs[style] || styleConfigs['warm-wood'];
  return createSVGDataURL(800, 600, config.bg, config.text, [
    { text: '安颐家 · 适老化改造', size: 28, weight: 'bold' },
    { text: config.label + '风格', size: 20, weight: 'normal' },
  ]);
}

const modifyResultTexts = [
  '防滑地面改造完成',
  '安全扶手安装方案',
  '无障碍卫浴改造',
  '适老照明优化',
  '全屋适老翻新',
  '紧急呼叫布局',
];

const agentSuggestions = [
  '根据您上传的空间照片，我识别到以下适老化风险点：\n\n1. 卫浴区缺少防滑措施\n2. 门口有5cm高差门槛\n3. 走廊缺少夜间照明\n4. 卫生间未安装安全扶手\n\n建议优先改造卫浴区域，这是老年人意外高发区域。',
  '我已为您生成适老化改造方案，主要包括：\n\n🏠 防滑地面处理 — 全屋防滑地砖/防滑木地板\n🦺 安全扶手安装 — 走廊、卫浴、楼梯双侧扶手\n💡 感应夜灯布置 — 走廊、卧室、卫浴感应照明\n📞 紧急呼叫系统 — 卧室、卫浴、走廊一键呼叫\n🚿 坐式淋浴改造 — 恒温花洒+防滑座椅\n\n请查看改造效果图。',
  '根据长者的行动能力评估（可扶行），我建议按以下优先级改造：\n\n🔴 紧急：卫浴防滑+扶手安装（跌倒风险最高）\n🟡 重要：消除全屋门槛高差（通行安全）\n🟢 改善：感应夜灯+紧急呼叫（夜间安全）\n\n预计改造周期5-7天，建议分阶段施工减少对长者生活影响。',
  '针对您的旧房适老化改造需求，我推荐分三步实施：\n\n第一步 · 安全保障\n- 全屋防滑地面处理\n- 消除门槛高差\n- 锐角家具圆角化\n\n第二步 · 辅助设施\n- 走廊/卫浴/楼梯扶手\n- 坐式淋浴+智能马桶\n- 紧急呼叫系统\n\n第三步 · 舒适提升\n- 感应夜灯系统\n- 适老厨房改造\n- 智能家居适配\n\n每步改造约3-5天，可根据预算灵活选择。',
];

export async function generateImage({ toolId, params, onProgress }) {
  const steps = [10, 25, 40, 55, 70, 85, 95, 100];
  for (let i = 0; i < steps.length; i++) {
    await sleep(300 + Math.random() * 500);
    onProgress?.(steps[i]);
  }

  const style = params.style || 'warm-wood';
  const seed = Date.now();

  return {
    id: `gen_${seed}`,
    toolId,
    imageUrl: getStyleImage(style),
    style,
    params,
    createdAt: new Date().toISOString(),
  };
}

export async function modifyImage({ toolId, params, onProgress }) {
  const steps = [15, 30, 50, 65, 80, 90, 100];
  for (let i = 0; i < steps.length; i++) {
    await sleep(250 + Math.random() * 400);
    onProgress?.(steps[i]);
  }

  const seed = Date.now();
  const text = modifyResultTexts[Math.floor(Math.random() * modifyResultTexts.length)];

  return {
    id: `mod_${seed}`,
    toolId,
    imageUrl: createSVGDataURL(800, 600, '#A0845C', '#FFFFFF', [
      { text: '安颐家 · 改造效果', size: 28, weight: 'bold' },
      { text: text, size: 18, weight: 'normal' },
    ]),
    params,
    createdAt: new Date().toISOString(),
  };
}

export async function chatWithAgent({ messages, onChunk }) {
  const response = agentSuggestions[Math.floor(Math.random() * agentSuggestions.length)];

  for (let i = 0; i < response.length; i++) {
    await sleep(15 + Math.random() * 30);
    onChunk?.(response.slice(0, i + 1));
  }

  const styleKey = Object.keys(styleConfigs)[Math.floor(Math.random() * Object.keys(styleConfigs).length)];

  return {
    role: 'assistant',
    content: response,
    imageUrl: getStyleImage(styleKey),
    createdAt: new Date().toISOString(),
  };
}
