 
const manageColor = (object, folder, parameter, onChange) => {
    const config = {};
  
    config[parameter[0]] = {
        r: object[parameter[0]].r * 255,
        g: object[parameter[0]].g * 255,
        b: object[parameter[0]].b * 255,
    };
  
    folder.addColor(config, parameter[0], parameter[1]).onChange((e) => {
        object[parameter[0]].r = e.r / 255;
        object[parameter[0]].g = e.g / 255;
        object[parameter[0]].b = e.b / 255;
  
        if (onChange) onChange(e);
    });
};

/**
 * Add a gui controller to a vector
 * @param {string} name
 * @param {THREE.Vector|THREE.Euler} vector
 * @param {integer} step
 * @returns {GUI} Returns the folder created for the vector.
 */

const addVectorFolder = (options) =>{
    const folder = options.folder.addFolder(options.name);
  
    if (Math.abs(options.vector.x) >= 0) folder.add(options.vector, 'x').step(options.step).min(options.min).max(options.max);
    if (Math.abs(options.vector.y) >= 0) folder.add(options.vector, 'y').step(options.step).min(options.min).max(options.max);
    if (Math.abs(options.vector.z) >= 0) folder.add(options.vector, 'z').step(options.step).min(options.min).max(options.max);
    if (Math.abs(options.vector.w) >= 0) folder.add(options.vector, 'w').step(options.step).min(options.min).max(options.max);
  
    return folder;
};


const materialDefine = [
    ['aoMapIntensity', 0, 1],
    ['bumpScale', 0, 1],
    ['clearCoat', 0, 1],
    ['clearCoatRoughness', 0, 1],
    ['color', 'color'],
    ['displacementScale', 0, 10],
    ['emissive', 'color'],
    ['emissiveIntensity', 0, 1],
    ['envMapIntensity', 0, 1],
    ['lightMapIntensity', 0, 1],
    ['metalness', 0, 1],
    ['opacity', 0, 1],
    ['reflectivity', 0, 1],
    ['refractionRatio', 0, 1],
    ['roughness', 0, 1],
    ['shininess', 0, 1],
    ['specular', 'color'],
    ['wireframe', true],
];
  
/**
   * Add a gui controller to a material.
   * @param {string} name
   * @param {THREE.Material} material
   * @returns {GUI} Returns the folder created for the material
   */
const addMaterialFolder = (options) => {
    const folder = options.folder.addFolder(options.name);
  
    materialDefine.forEach(parameter => {
        if (!options.material.hasOwnProperty(parameter[0])) return;
        if (parameter[1] === 'color') {
            manageColor(
                options.material,
                folder,
                parameter,
                () => (options.material.needsUpdate = true),
            );
        } else {
            folder
                .add(options.material, parameter[0], parameter[1], parameter[2])
                .onChange(() => (options.material.needsUpdate = true));
        }
    });
  
    return folder;
};
const addBasicParam = (options) => {
    const folder = options.folder.addFolder(options.name);
    if (options.controls) {
        folder.add(options.param, options.name).step(options.controls.step).min(options.controls.min).max(options.controls.max).onChange(() => {
            options.onUpdateParam();
        });
    }else {
        folder.add(options.param, options.name).onChange(() => {
            options.onUpdateParam();
        });
    }
};
export {
    addVectorFolder,
    addMaterialFolder,
    addBasicParam,
};
