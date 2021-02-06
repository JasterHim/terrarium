const FOLDER = './Textures';
const textures = {
    'death'    : 'Death.png',
    'grass'    : 'Grass.png',
    'ground'   : 'Ground.png',
    'mountain' : 'Mountain.png',
    'plant'    : 'Plant.png',
    'sand'     : 'Sand.png',
    'sheep'    : 'SatanSheep2.png',
    'tiger'    : 'Tiger2.png',
    'wall'     : 'Wall.png',
    'wall2'    : 'Wall.tif'
};

class Texture {
    constructor (type) {
        const texture = textures [type];

        if (!texture) {
            throw new Error ('Texture  does not exist ' + type);
        }
        this.path = [FOLDER, texture].join('/');
    }

    static dimensions (width, height) {
        Texture.width = width;
        Texture.height = height;
    }

    static background(texture) {
       
        Texture._background = [FOLDER, textures[texture]].join('/');
    }
    static debug(debug = false) {
       
        Texture._debug = debug;
    }
    render (stats) {
        const div = document.createElement('div');

        div.innerText = stats || '';
        if (Texture._debug) {
            div.style.fontSize = Math.floor(Texture.height / 2) + 'px';
        }

       
        div.style.width = Texture.width + 'px';
        div.style.height = Texture.height + 'px';
        div.style.lineHeight = (Texture.height + 2) + 'px';
        div.style.display = 'inline-block';

        div.style.background = `url(${this.path}), url(${Texture._background})`;
        div.style.backgroundSize = '100%';

        return div;
    }
}