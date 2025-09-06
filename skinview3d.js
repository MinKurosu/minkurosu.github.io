const skins = [
    {
        id: 'skin_viewer_steve',
        url: 'https://textures.minecraft.net/texture/c9d2f627bb53c614b09335ef00a20f924372a727c4ff192938e21a24d55705' // Steve
    },
    {
        id: 'skin_viewer_alex',
        url: 'https://files.catbox.moe/uknvlp.png'
    },
    {
        id: 'skin_viewer_custom1',
        url: 'https://textures.minecraft.net/texture/3f32e987c69a7c36a6e9a9d9e6f3b0e2b4f9f6e1f0e2b4f9f6e1f0e2b4f9f6e1' // Exemplo de skin customizada (substitua pela sua URL real)
    },
    {
        id: 'skin_viewer_custom2',
        url: 'https://textures.minecraft.net/texture/a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3' // Outro exemplo de skin customizada (substitua pela sua URL real)
    }
];

skins.forEach(skinData => {
    const canvasElement = document.getElementById(skinData.id);
    if (canvasElement) {
        const skinViewer = new skinview3d.FXAASkinViewer({
            canvas: canvasElement,
            width: 200,
            height: 300,
            skin: skinData.url
        });

        skinViewer.animation = new skinview3d.WalkingAnimation();
        skinViewer.controls.enableZoom = true;
        skinViewer.controls.enablePan = true;
    } else {
        console.error('Canvas element not found for ID:', skinData.id);
    }
});
