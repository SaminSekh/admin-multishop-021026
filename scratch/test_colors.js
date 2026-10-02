// Test color resolution function
function createColorResolver() {
    const map = {
        // Whites & Off-Whites
        'white': '#ffffff',
        'pure white': '#ffffff',
        'snow white': '#fffafa',
        'off white': '#faf9f6',
        'off-white': '#faf9f6',
        'ivory': '#fffff0',
        'cream': '#fffdd0',
        'white cream': '#faf6eb',
        'cream white': '#faf6eb',
        'milk white': '#fefcf6',
        'milky white': '#fefcf6',
        'milk': '#fefcf6',
        'pearl white': '#eae0c8',
        'pearl': '#eae0c8',
        'vanilla': '#f3e5ab',
        'eggshell': '#f0ead6',
        'bone': '#e3dac9',
        'ecru': '#c2b280',
        'linen': '#faf0e6',
        'cotton': '#fafbf8',
        'chalk': '#f5f5f0',
        'alabaster': '#edeae0',
        'parchment': '#f1e9d2',

        // Greys & Blacks
        'black': '#000000',
        'jet black': '#0a0a0a',
        'pitch black': '#050505',
        'matte black': '#1c1c1c',
        'washed black': '#2b2b2b',
        'ink black': '#1b1b22',
        'ink': '#1b1b22',
        'onyx': '#353839',
        'ebony': '#282c34',
        'midnight': '#12172a',
        'grey': '#808080',
        'gray': '#808080',
        'light grey': '#d3d3d3',
        'light gray': '#d3d3d3',
        'white grey': '#e5e7eb',
        'white gray': '#e5e7eb',
        'dark grey': '#505050',
        'dark gray': '#505050',
        'charcoal': '#36454f',
        'charcoal grey': '#36454f',
        'charcoal gray': '#36454f',
        'ash grey': '#b2beb5',
        'ash gray': '#b2beb5',
        'ash': '#b2beb5',
        'smoke grey': '#708090',
        'smoke gray': '#708090',
        'smoke': '#708090',
        'slate grey': '#708090',
        'slate gray': '#708090',
        'slate': '#708090',
        'silver': '#c0c0c0',
        'light silver': '#e5e7eb',
        'heather grey': '#b0b4b8',
        'heather gray': '#b0b4b8',
        'heather': '#b0b4b8',
        'melange grey': '#9ca3af',
        'melange gray': '#9ca3af',
        'melange': '#9ca3af',
        'dove grey': '#b3b1a9',
        'dove gray': '#b3b1a9',
        'dove': '#b3b1a9',
        'steel grey': '#71797e',
        'steel gray': '#71797e',
        'steel': '#71797e',
        'gunmetal': '#2c3539',
        'graphite': '#41424c',
        'fog': '#d6d6d6',
        'pebble': '#aca79f',
        'cement': '#a5a5a5',
        'anthracite': '#383e42',

        // Blues & Denims
        'blue': '#2563eb',
        'navy blue': '#000080',
        'navy': '#000080',
        'dark navy': '#00004d',
        'royal blue': '#4169e1',
        'sky blue': '#87ceeb',
        'light blue': '#add8e6',
        'dark blue': '#00008b',
        'baby blue': '#89cff0',
        'powder blue': '#b0e0e6',
        'ice blue': '#afeeee',
        'cornflower blue': '#6495ed',
        'cornflower': '#6495ed',
        'steel blue': '#4682b4',
        'denim blue': '#1560bd',
        'denim': '#1560bd',
        'light denim': '#8fb1d4',
        'dark denim': '#1d2951',
        'indigo': '#4b0082',
        'cobalt blue': '#0047ab',
        'cobalt': '#0047ab',
        'cerulean': '#007ba7',
        'teal blue': '#008080',
        'teal': '#008080',
        'turquoise': '#40e0d0',
        'aqua': '#00ffff',
        'aquamarine': '#7fffd4',
        'cyan': '#00ffff',
        'ocean blue': '#0077be',
        'ocean': '#0077be',
        'petrol blue': '#1f6a7d',
        'petrol': '#1f6a7d',
        'dusty blue': '#8ca3b8',
        'faded blue': '#6b8e99',
        'midnight blue': '#191970',
        'sapphire': '#0f52ba',
        'azure': '#007fff',
        'electric blue': '#7df9ff',
        'light wash blue': '#89cff0',
        'medium wash blue': '#3b82f6',
        'dark wash blue': '#00008b',
        'vintage blue': '#799dbf',
        'stone wash blue': '#829db3',
        'acid wash blue': '#9ebfcc',
        'rinse wash': '#18294a',
        'raw denim': '#1c2841',
        'black wash': '#1c1c1c',
        'grey wash': '#7a7a7a',
        'charcoal wash': '#424242',
        'white denim': '#f4f4f4',
        'ecru denim': '#c2b280',
        'indigo denim': '#2b3e5a',

        // Earth, Sand, Khaki, Brown
        'beach': '#e8d8b8',
        'sand': '#c2b280',
        'sandy': '#c2b280',
        'desert sand': '#edc9af',
        'desert': '#edc9af',
        'cashmere': '#d1bfa7',
        'khaki': '#c3b091',
        'light khaki': '#f0e68c',
        'dark khaki': '#bdb76b',
        'beige': '#f5f5dc',
        'light beige': '#faf0e6',
        'dark beige': '#d0c5a8',
        'tan': '#d2b48c',
        'light tan': '#e6d5b8',
        'dark tan': '#91815b',
        'camel': '#c19a6b',
        'fawn': '#e5aa70',
        'taupe': '#8b8589',
        'warm taupe': '#b38b6d',
        'brown': '#8b4513',
        'light brown': '#a0522d',
        'dark brown': '#5c4033',
        'chocolate': '#7b3f00',
        'chocolate brown': '#7b3f00',
        'coffee': '#4a2c2a',
        'coffee brown': '#4a2c2a',
        'mocha': '#492a17',
        'espresso': '#361b0d',
        'walnut': '#773f1a',
        'chestnut': '#954535',
        'cinnamon': '#d2691e',
        'copper': '#b87333',
        'bronze': '#cd7f32',
        'terracotta': '#e2725b',
        'clay': '#b66a50',
        'biscuit': '#ffe4c4',
        'champagne': '#f7e7ce',
        'oatmeal': '#e3dac9',
        'nude': '#f2d3bc',
        'stone': '#877f6c',
        'almond': '#efdecd',
        'caramel': '#c68642',
        'toffee': '#75482f',
        'hazelnut': '#bda55d',
        'rust': '#b7410e',
        'sienna': '#a0522d',
        'burnt orange': '#cc5500',

        // Pinks & Roses
        'pink': '#ec4899',
        'creamy pink': '#f8c8dc',
        'cream pink': '#f8c8dc',
        'blush pink': '#ffb6c1',
        'blush': '#ffb6c1',
        'baby pink': '#f4c2c2',
        'light pink': '#ffb6c1',
        'pastel pink': '#ffd1dc',
        'dusty pink': '#dcae96',
        'dusty rose': '#dcae96',
        'rose': '#ff66cc',
        'rose pink': '#ff66cc',
        'powder pink': '#ffd8de',
        'soft pink': '#ffd1df',
        'hot pink': '#ff69b4',
        'neon pink': '#ff10f0',
        'deep pink': '#ff1493',
        'flamingo': '#fc8eac',
        'salmon': '#fa8072',
        'salmon pink': '#fa8072',
        'coral': '#ff7f50',
        'coral pink': '#ff7f50',
        'peach': '#ffe5b4',
        'peach pink': '#ffe5b4',
        'apricot': '#fbceb1',
        'magenta': '#ff00ff',
        'fuchsia': '#ff00ff',
        'bubblegum': '#ffc1cc',
        'carnation': '#ffa6c9',
        'mauve': '#e0b0ff',

        // Reds & Maroons
        'red': '#ef4444',
        'light red': '#ff7f7f',
        'dark red': '#8b0000',
        'crimson': '#dc143c',
        'scarlet': '#ff2400',
        'ruby': '#e0115f',
        'ruby red': '#e0115f',
        'cherry': '#d2042d',
        'cherry red': '#d2042d',
        'brick red': '#cb4154',
        'brick': '#cb4154',
        'cardinal': '#c41e3a',
        'garnet': '#733635',
        'blood red': '#7e191b',
        'maroon': '#800000',
        'burgundy': '#800020',
        'wine': '#722f37',
        'wine red': '#722f37',
        'bordeaux': '#5c0120',
        'oxblood': '#4a0000',
        'berry': '#990f4b',
        'plum': '#8e4585',
        'cranberry': '#9e003a',

        // Purples & Lavenders
        'purple': '#a855f7',
        'light purple': '#cbc3e3',
        'dark purple': '#301934',
        'violet': '#8f00ff',
        'lavender': '#e6e6fa',
        'lilac': '#c8a2c8',
        'periwinkle': '#ccccff',
        'orchid': '#da70d6',
        'thistle': '#d8bfd8',
        'iris': '#5d3fd3',
        'amethyst': '#9966cc',
        'grape': '#6f2da8',
        'eggplant': '#3b0910',
        'aubergine': '#3b0910',
        'mulberry': '#c54b8c',

        // Greens & Olives
        'green': '#008000',
        'light green': '#90ee90',
        'dark green': '#006400',
        'olive': '#556b2f',
        'olive green': '#556b2f',
        'light olive': '#808000',
        'dark olive': '#3b3c36',
        'army green': '#4b5320',
        'military green': '#4c583e',
        'forest green': '#228b22',
        'pine green': '#01796f',
        'hunter green': '#355e3b',
        'emerald': '#50c878',
        'emerald green': '#50c878',
        'mint': '#98ff98',
        'mint green': '#98ff98',
        'sea green': '#2e8b57',
        'sage': '#8a9a5b',
        'sage green': '#8a9a5b',
        'moss': '#8a9a5b',
        'moss green': '#8a9a5b',
        'lime': '#32cd32',
        'lime green': '#32cd32',
        'pistachio': '#93c572',
        'bottle green': '#006a4e',
        'chartreuse': '#7fff00',
        'jade': '#00a86b',
        'basil': '#577a3a',
        'cypress': '#545a3e',
        'neon green': '#39ff14',
        'seafoam': '#9fe2bf',
        'seafoam green': '#9fe2bf',
        'eucalyptus': '#5f8575',
        'khaki green': '#727c59',

        // Yellows & Oranges
        'yellow': '#eab308',
        'light yellow': '#ffffe0',
        'pale yellow': '#fffacd',
        'lemon': '#fff44f',
        'lemon yellow': '#fff44f',
        'mustard': '#ffdb58',
        'mustard yellow': '#ffdb58',
        'ochre': '#cc7722',
        'gold': '#ffd700',
        'golden': '#ffd700',
        'goldenrod': '#daa520',
        'honey': '#eb9605',
        'canary': '#ffef00',
        'buttercup': '#f3e5ab',
        'neon yellow': '#ccff00',
        'orange': '#f97316',
        'light orange': '#ffd180',
        'dark orange': '#ff8c00',
        'tangerine': '#f28500',
        'marigold': '#eaa221',
        'sunset': '#fd5e53',
        'neon orange': '#ff5f1f',
        'pumpkin': '#ff7518',

        // Multi / Patterns
        'multicolor': 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)',
        'multi color': 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)',
        'multi-color': 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)',
        'multi': 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)',
        'rainbow': 'linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet)',
        'checkered': 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px',
        'plaid': 'repeating-linear-gradient(45deg, #d11f26, #d11f26 10px, #8b0000 10px, #8b0000 20px)',
        'striped': 'repeating-linear-gradient(45deg, #000, #000 5px, #fff 5px, #fff 10px)',
        'tie-dye': 'radial-gradient(circle, #ff00ff, #00ffff, #ffff00, #ff0000)',
        'tie dye': 'radial-gradient(circle, #ff00ff, #00ffff, #ffff00, #ff0000)',
        'tiedye': 'radial-gradient(circle, #ff00ff, #00ffff, #ffff00, #ff0000)',
        'ombre': 'linear-gradient(to bottom, #ef4444, #ffffff)',
        'camouflage': 'linear-gradient(45deg, #4b5320 25%, #556b2f 25%, #556b2f 50%, #4b5320 50%, #4b5320 75%, #556b2f 75%, #556b2f 100%)',
        'camo': 'linear-gradient(45deg, #4b5320 25%, #556b2f 25%, #556b2f 50%, #4b5320 50%, #4b5320 75%, #556b2f 75%, #556b2f 100%)',
        'floral': 'radial-gradient(circle at 30% 30%, #ec4899, #a855f7, #3b82f6)',
        'printed': 'radial-gradient(circle at center, #f59e0b, #ec4899, #8b5cf6)',
        'graphic print': '#e5e7eb',
        'color block': 'linear-gradient(to right, #ef4444 33%, #eab308 33%, #eab308 66%, #3b82f6 66%)'
    };

    return function getColorHex(name) {
        if (!name || typeof name !== 'string') return null;
        const raw = name.toLowerCase().trim();
        if (!raw) return null;

        // 1. Exact raw or hyphen-replaced match
        if (map[raw]) return map[raw];
        const normalized = raw.replace(/[-_/]/g, ' ').replace(/\s+/g, ' ').trim();
        if (map[normalized]) return map[normalized];

        // 2. Direct hex or rgb format check
        if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return raw;
        if (/^(rgb|hsl)a?\(.+?\)$/i.test(raw)) return raw;

        // 3. Composite variant names like "Creamy Pink / XL" or "Blue - 38" or "Beach (M)"
        const parts = raw.split(/[\/\-\,\(\)]/);
        if (parts.length > 1) {
            const firstPart = parts[0].trim();
            const firstNorm = firstPart.replace(/[-_/]/g, ' ').replace(/\s+/g, ' ').trim();
            if (map[firstPart]) return map[firstPart];
            if (map[firstNorm]) return map[firstNorm];
        }

        // 4. Modifier + base color decomposition (e.g. "creamy lavender", "pale pink", "dusty green", "soft blue")
        const words = normalized.split(' ');
        if (words.length > 1) {
            const lastWord = words[words.length - 1];
            const lastTwo = words.slice(-2).join(' ');
            const baseColor = map[lastTwo] || map[lastWord];
            if (baseColor && !baseColor.includes('gradient')) {
                return baseColor;
            }
        }

        // 5. Native CSS color validation fallback in browser (Option element)
        if (typeof window !== 'undefined' && window.Option) {
            try {
                const s = new window.Option().style;
                s.color = normalized;
                if (s.color) return normalized;
            } catch (e) {}
        }

        return null;
    };
}

const getColorHex = createColorResolver();

const testCases = [
    'light grey', 'blue', 'beach', 'white grey', 'white cream', 'cashmere', 'blush pink', 'creamy pink',
    'Creamy Pink', 'Light Grey', 'Blue', 'Beach', 'White Grey', 'White Cream', 'Cashmere', 'Blush Pink',
    'creamy pink / XL', 'Light grey - M', 'Navy Blue', 'Wine', 'Olive green', 'Mustard', 'Charcoal',
    'Rust', 'Peach', 'Lavender', 'Sage green', 'Multicolor', 'Tie-Dye', 'XL', 'Pack of 3', '#ff5722'
];

console.log('Results:');
testCases.forEach(tc => {
    console.log(`${tc.padEnd(20)} => ${getColorHex(tc)}`);
});
