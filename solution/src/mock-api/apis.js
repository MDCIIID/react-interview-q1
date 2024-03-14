/**
 * do not change the implementation
 */
export const isNameValid = (name) => new Promise((resolve) => {
    console.log('incoming name: ', name)
    setTimeout(() => {
        resolve(name !== 'invalid name');
    }, Math.random() * 2000);
});

/**
 * do not change the implementation
 */
export const getLocations = () => Promise.resolve(['Canada', 'China', 'USA', 'Brazil']);
