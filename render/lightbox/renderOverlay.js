// Render Overlay
export function renderOverlay() {
    // Hide board menu if it's rendered
    const boardMenu = document.getElementById('boardMenu');
    if (boardMenu) {
        boardMenu.remove();
    }

    // <body>
    const body = document.getElementById('body');

    // Overlay <div>
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    body.insertAdjacentElement('afterbegin', overlay);
}