/**
 * 
 * Extend Object
 * 
 * @template A
 * @template B
 * @param {A} defaults
 * @param {B} object
 * @returns {(A & B)}
 */
export const extend = <A, B>(defaults: A, object: B): A & B => {

    Object.keys(defaults).map(property => {

        if (typeof object[property] === 'object') {
            return object[property] = extend(defaults[property], object[property]);
        }

        let type = typeof object[property];

        if (type !== 'undefined' && typeof defaults[property] !== type) {

            object[property] = {
                enabled: object[property]
            };

            return object[property] = extend(defaults[property], object[property]);

        }

        object[property] = object[property] === undefined ? defaults[property] : object[property];

    });

    return <A & B>object;

};

/**
 * Group items by a specific key
 */
export const groupBy = (items: any[], key: string): {} => {

    const collection = {};

    items.forEach(item => {
        if (item.hasOwnProperty(key)) {
            if (!collection[item[key]]) {
                collection[item[key]] = [item];
            } else {
                collection[item[key]].push(item);
            }
        } else {
            throw 'You shouldnt be seing this message...';
        }
    });

    return collection;

};

/**
 * Key object by some subkey of itself
 */
export const keyBy = (items: any[], key: string): {} => {

    const collection = {};

    items.forEach(item => collection[item[key]] = item);

    return collection;

};

/**
 * Convert String to CamelCase
 *
 * @param str
 * @returns {string}
 */
export const toCamelCase = (str: string): string => {
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};