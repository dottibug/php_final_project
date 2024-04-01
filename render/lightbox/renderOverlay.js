// Render Overlay
export function renderOverlay() {
    // <body>
    const body = document.getElementById('body');
    
    // Overlay <div>
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    body.insertAdjacentElement('afterbegin', overlay);
}