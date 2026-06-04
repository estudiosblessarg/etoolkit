/**
 * Resistor utilities
 * Devuelve bandas de colores y renderiza un elemento visual simple
 */
const DIGIT_COLOR = ['black','brown','red','orange','yellow','green','blue','violet','gray','white'];
const MULTIPLIER_COLOR = {
    '-2': 'silver',
    '-1': 'gold',
    '0': 'black',
    '1': 'brown',
    '2': 'red',
    '3': 'orange',
    '4': 'yellow',
    '5': 'green',
    '6': 'blue',
    '7': 'violet',
    '8': 'gray',
    '9': 'white'
};

export function getResistorColorBands(valueOhm, tolerancePercent = 5) {
    const v = Number(valueOhm);
    if (!isFinite(v) || v <= 0) return null;

    // Find two significant digits and multiplier (power of 10)
    const exponent = Math.floor(Math.log10(v));
    let mantissa = v / Math.pow(10, exponent);

    // Bring mantissa to range [10,99]
    let exp = exponent;
    if (mantissa < 10) {
        mantissa = v / Math.pow(10, exponent - 1);
        exp = exponent - 1;
    }

    let sig = Math.round(mantissa * 1);
    if (sig >= 100) {
        sig = Math.round(sig / 10);
        exp += 1;
    }

    const d1 = Math.floor(sig / 10) % 10;
    const d2 = sig % 10;

    const multiplier = exp;
    const multiplierColor = MULTIPLIER_COLOR[String(multiplier)] || 'black';

    const toleranceColor = (tolerancePercent === 5) ? 'gold' : (tolerancePercent === 1 ? 'brown' : 'silver');

    return [DIGIT_COLOR[d1], DIGIT_COLOR[d2], multiplierColor, toleranceColor];
}

export function renderResistorBands(valueOhm, tolerancePercent = 5) {
    const bands = getResistorColorBands(valueOhm, tolerancePercent);
    if (!bands) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'resistor-visual';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '0.25rem';

    const body = document.createElement('div');
    body.style.height = '18px';
    body.style.width = '120px';
    body.style.background = 'linear-gradient(90deg,#e6e6e6,#d4d4d4)';
    body.style.borderRadius = '8px';
    body.style.display = 'flex';
    body.style.alignItems = 'center';
    body.style.justifyContent = 'flex-start';
    body.style.padding = '0 8px';

    bands.forEach(color => {
        const b = document.createElement('div');
        b.style.width = '10px';
        b.style.height = '14px';
        b.style.marginRight = '6px';
        b.style.background = color;
        b.style.borderRadius = '2px';
        b.style.border = '1px solid rgba(0,0,0,0.2)';
        body.appendChild(b);
    });

    const label = document.createElement('div');
    label.className = 'resistor-label';
    label.style.marginLeft = '8px';
    label.style.color = 'var(--text-tertiary)';
    label.style.fontSize = '0.9rem';
    label.textContent = `${formatResistor(valueOhm)} Ω`;

    wrapper.appendChild(body);
    wrapper.appendChild(label);
    return wrapper;
}

function formatResistor(v) {
    if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(2)}k`;
    if (v >= 1) return `${v.toFixed(2)}`;
    return v.toPrecision(3);
}

export default { getResistorColorBands, renderResistorBands };
