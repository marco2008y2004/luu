'use strict';

const flowerData = {
    petals: [
    { id: 'petal-0', name: 'I’ll imagine we fell in love (Imaginaré que nos enamoramos)', images: ['9.png'], soundFile: 'music/music.mp3' },
    { id: 'petal-1', name: 'Under moonlight skies with you (Bajo cielos de luna contigo)', images: ['2.png'], soundFile: 'music/music.mp3' },
    { id: 'petal-2', name: 'The ocean’s colors on your face (Los colores del océano en tu rostro)', images: ['10.png'], soundFile: 'music/music.mp3' },
    { id: 'petal-3', name: 'Let me fly with you (Déjame volar contigo)', images: ['3.png'], soundFile: 'music/music.mp3' },
    { id: 'petal-4', name: 'I could stare like watching stars (Podría mirarte como a las estrellas)', images: ['11.png'], soundFile: 'music/music.mp3' },
    { id: 'petal-5', name: 'Will you be forever with me? (Estare contigo para siempre)', images: ['6.png'], soundFile: 'music/music.mp3' },
    { id: 'petal-6', name: 'My love will always stay by you (Mi amor siempre estará a tu lado)', images: ['5.png'], soundFile: 'music/cermusicati.mp3' },
    { id: 'petal-7', name: 'It’s stuck with you forever (Me quedará contigo por siempre)', images: ['11.png'], soundFile: 'music/music.mp3' }
    ],
    center: {
        id: 'center',
        name: 'SOLO TUUU',
        images: ['7.png'],
        soundFile: 'yung.mp3'
    },
    leaves: [
        { id: 'leaf-1', name: 'Siempre estare para ti', images: ['4.png'], soundFile: 'music/music.mp3' },
        { id: 'leaf-2', name: 'Love You', images: ['9.png'], soundFile: 'music/music.mp3' }
    ]
};

const e = React.createElement;

// Tooltip
const Tooltip = ({ text, position }) => {
    if (!text) return null;
    const style = {
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
    };
    return e('div', { className: 'tooltip', style }, text);
};


const Modal = ({ content, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        if (content) setCurrentImageIndex(0);
    }, [content]);

    if (!content) return null;

    const nextImage = () =>
        setCurrentImageIndex(prev => (prev + 1) % content.images.length);
    const prevImage = () =>
        setCurrentImageIndex(prev => (prev - 1 + content.images.length) % content.images.length);

    return e('div', { className: 'modal-overlay', onClick: onClose },
        e('div', { className: 'modal-content', onClick: e => e.stopPropagation() },
            e('button', { className: 'modal-close', onClick: onClose }, '×'),
            e('h2', { className: 'modal-title' }, content.name),
            e('div', { className: 'gallery' },
                content.images.length > 1 && e('button', { className: 'gallery-nav', onClick: prevImage }, '‹'),
                e('img', {
                    className: 'gallery-image',
                    src: content.images?.[currentImageIndex],
                    alt: `${content.name} ${currentImageIndex + 1}`,
                    onError: (e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/ccc/333?text=Imagen+no+encontrada"; }
                }),
                content.images.length > 1 && e('button', { className: 'gallery-nav', onClick: nextImage }, '›')
            )
        )
    );
};

const App = () => {
    const [modalContent, setModalContent] = React.useState(null);
    const [hoveredItem, setHoveredItem] = React.useState({ name: null, position: { x: 0, y: 0 } });
    const [hoveredPetal, setHoveredPetal] = React.useState(null);

    const audioRef = React.useRef(null);

    const handleItemClick = (itemData) => {
        // 🔥 Solo iniciar música si aún no hay nada sonando
        if (!audioRef.current && itemData.soundFile) {
            const newAudio = new Audio(itemData.soundFile);
            newAudio.loop = true; // 🔁 bucle infinito
            audioRef.current = newAudio;
            newAudio.play().catch(error => console.error("Error al reproducir audio:", error));
        }
        setModalContent(itemData);
    };

    const handleMouseEnter = (itemData, event) =>
        setHoveredItem({ name: itemData.name, position: { x: event.clientX, y: event.clientY } });
    const handleMouseMove = (event) => {
        if (hoveredItem.name) {
            setHoveredItem(prev => ({ ...prev, position: { x: event.clientX, y: event.clientY } }));
        }
    };
    const handleMouseLeave = () => setHoveredItem({ name: null, position: { x: 0, y: 0 } });
    const handlePetalEnter = (petalId) => setHoveredPetal(petalId);
    const handlePetalLeave = () => setHoveredPetal(null);

    // ❌ Ya no detenemos el audio al cerrar modal
    const closeModal = () => {
        setModalContent(null);
    };

    return e('div', { className: 'App', onMouseMove: handleMouseMove },
        e(Tooltip, { text: hoveredItem.name, position: hoveredItem.position }),
        e(Modal, { content: modalContent, onClose: closeModal }),
        e('div', { className: 'heading' }, modalContent ? modalContent.name : 'Para ti - Te amo'),
        e('svg', { viewBox: "0 0 244 400" },
            e('defs', null,
                e('path', { d: "M223.120444,246.724259 C216.601694,240.205509 198.89935,211.936759 205.4181,205.418009 C211.93685,198.899259 240.2056,216.603165 246.72435,223.120353 C253.2431,229.639103 253.2431,240.205509 246.72435,246.724259 C240.2056,253.241446 229.638412,253.241446 223.120444,246.724259 Z", id: "path-petal" }),
                e('filter', { x: "-18.9%", y: "-18.9%", width: "137.8%", height: "137.8%", filterUnits: "objectBoundingBox", id: "filter-petal" },
                    e('feOffset', { dx: "0", dy: "0", in: "SourceAlpha", result: "shadowOffsetOuter1" }),
                    e('feGaussianBlur', { stdDeviation: "3", in: "shadowOffsetOuter1", result: "shadowBlurOuter1" }),
                    e('feColorMatrix', { values: "0 0 0 0 0.482352941  0 0 0 0 0.384313725  0 0 0 0 0.384313725 0 0 0 0.5 0", type: "matrix", in: "shadowBlurOuter1" })
                ),
                e('circle', { id: "path-sm-circle", cx: "27", cy: "27", r: "27" }),
                e('circle', { id: "path-lg-circle", cx: "27", cy: "27", r: "18" })
            ),
            e('g', { id: "Flor-Corregida" },
                e('g', { id: "Tallo-y-Hojas" },
                    e('path', { d: "M122,185 C 115,240, 130,280, 122,382", stroke: "#4CAF50", strokeWidth: "4", fill: "none" }),
                    e('path', {
                        d: "M120,250 Q 80,240, 70,280 Q 90,290, 118,265 Z",
                        fill: "#66BB6A", stroke: "#388E3C", strokeWidth: "1.5", className: "leaf",
                        onClick: () => handleItemClick(flowerData.leaves?.[0]),
                        onMouseEnter: (evt) => handleMouseEnter(flowerData.leaves?.[0], evt),
                        onMouseLeave: handleMouseLeave
                    }),
                    e('path', {
                        d: "M124,295 Q 165,285, 175,325 Q 155,335, 126,310 Z",
                        fill: "#66BB6A", stroke: "#388E3C", strokeWidth: "1.5", className: "leaf",
                        onClick: () => handleItemClick(flowerData.leaves?.[1]),
                        onMouseEnter: (evt) => handleMouseEnter(flowerData.leaves?.[1], evt),
                        onMouseLeave: handleMouseLeave
                    })
                ),
                e('g', { id: "Pivote-Cabeza", transform: "translate(122, 185)" },
                    e('g', { id: "Arte-Flor", transform: "translate(-200, -200)" },
                        e('g', { id: "Petal-group", fillRule: "nonzero" },
                            flowerData.petals.map((petal, i) => {
                                const rotate = i > 3 ? `rotate(${90 * i + 45} 200 200)` : `rotate(${90 * i} 200 200)`;
                                const isHovered = hoveredPetal === petal.id;
                                const petalFill = isHovered ? "#f2f2f2" : "#FFFFFF";
                                return e('g', {
                                    key: petal.id, id: petal.id, className: 'petal', transform: rotate,
                                    onClick: () => handleItemClick(petal),
                                    onMouseEnter: (evt) => { handleMouseEnter(petal, evt); handlePetalEnter(petal.id); },
                                    onMouseLeave: () => { handleMouseLeave(); handlePetalLeave(); }
                                },
                                    e('use', { fill: "black", fillOpacity: "1", filter: "url(#filter-petal)", href: "#path-petal" }),
                                    e('use', { fill: petalFill, href: "#path-petal", style: { transition: "fill 0.3s ease" } })
                                );
                            })
                        ),
                        e('g', {
                            id: "Center", transform: "translate(173, 173)", className: 'flower-center-interactive',
                            onClick: () => handleItemClick(flowerData.center),
                            onMouseEnter: (evt) => handleMouseEnter(flowerData.center, evt),
                            onMouseLeave: handleMouseLeave
                        },
                            e('use', { fill: "#F9E589", href: "#path-sm-circle" }),
                            e('use', { fill: "#F6C261", href: "#path-lg-circle" })
                        )
                    )
                )
            )
        )
    );
};

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(App));
