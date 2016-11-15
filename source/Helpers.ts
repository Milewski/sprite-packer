/**
 * 
 * Extend Configuration File
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

        let objectType = typeof object[property],
            defaultType = typeof defaults[property];

        if (objectType !== 'undefined' && defaultType !== objectType) {

            let alias = first(defaults[property]),
                isBool = typeof defaults[property][alias];

            if (alias === undefined && typeof (object[property]) === 'undefined') {
                return object[property] = defaults[property];
            } else if (object[property]) {
                return object[property] = String(object[property]).toLowerCase() === 'true';
            }

            object[property] = {
                [alias]: (isBool === 'boolean') ?
                    object[property] !== defaults[property][alias] :
                    object[property] || defaults[alias]
            };

            return object[property] = extend(defaults[property], object[property]);

        }

        return object[property] = object[property] === undefined ? defaults[property] : object[property];

    });

    return <A & B>object;

};

/**
 * Get The first property name of an object
 */
export const first = function (object: {}): string {
    for (let property in object) return property;
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