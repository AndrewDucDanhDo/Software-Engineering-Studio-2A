/**
 * @return {number}
 */
export function VToPixels(v) {
    if (v.includes("vw")) {
        let value = parseFloat(v.replace("vw", ""));
        return (window.innerWidth / 100) * value;
    } else if (v.includes("vh")) {
        let value = parseFloat(v.replace("vh", ""));
        return (window.innerWidth / 100) * value;
    }
    return 0;
}