class Terra {
    isEdited = false; 

    constructor ({
        size = 10, 
        step =250,
        background = 'sand',
        creatureConfigs = [],
        textureSize = 15,
        debug = false,
    }) {
        this.size = size;
        this.grid = new Grid(size);
        this.step = step;
        this.steps = 0;
        this.creatures =  [];
        this.background = background;
        this.creatureConfigs = creatureConfigs;
        Texture.dimensions(textureSize, textureSize);
        Texture.background(background);
        Texture.debug(debug);
        }

        add(point, creature) {
            this.grid.place(point, creature);
            this.creatures.push(creature);
        }

        get(point) {
            return this.grid.get(point);
        }

        move(point, creature) {
            this.grid.remove(creature.coordinates);
            this.grid.place(point, creature);
        }

        remove(creature) {
            const point = creature.coordinates;
            this.grid.remove(point);
            const creatures = [];
            
            for (const c of this.creatures) {
                if (c === creature) continue;
                creatures.push(c);
            }

            this.creatures = creatures;
        }

        start() {
            this.interval = setInterval(() => {
                for (const creature of this.creatures) {
                    creature.action(this);
                }
                for (const creature of this.creatures) {
                    if (creature.energy < 1) {
                        this.remove(creature)
                    }
                }
                this.draw();
                this.step++;
            }, this.step);
            this.draw();
        }

        stop() {
            clearInterval(this.interval);
        }

        load(map) {
            if (!Array.isArray(map)) {
                throw new Error ('map should be array');
            }

            if (!map.length === this.size ** 2) {
                throw new Error ("map dimension are distorted");
            }

            this.creature = [];
            this.steps = 0;
            this.grid= new Grid(this.size);

            let index = 0;
            for (let x =0; x<this.size;x++) {
                for (let y = 0; y < this.size; y++) {
                    const symbol = map[index];
                    const Constructor = getCreaturesBySymbol(symbol);

                    if (Constructor) {
                        const point = new Point (x, y);
                        const creature = new Constructor(point);
                        this.add(point, creature);
                    }
                    
                    index++;
                }
            }
        }

        save() {
            const array = [];
            for (let x =0; x<this.size;x++) {
                for (let y = 0; y < this.size; y++) {
                    const cell = this.grid.get(new Point(x, y));
                    const symbol = getSymbolByCreature(cell);
                   
                    array.push(symbol || '');
                }
            }
            return array;

        }

        draw() {
            let container = document.querySelector ('.terra');
            if (!container) {
                container = document.createElement('div');
                container.className = 'terra';
                document.body.appendChild(container);
            }
            
            container.innerHTML = '';
            const def = new Texture(this.background);
            
            
            for (let x=0; x<this.grid.width;x++) {
                const row = document.createElement("div");
                for (let y=0; y<this.grid.height;y++){
                   const point = new Point (x, y);
                   const object = this.grid.get(point);
                   const element = object ? object.draw() : def.render();
                   element.id = `point-${x}-${y}`;

                   row.appendChild(element);                     
                } 
                container.appendChild(row);
            }   

            
            
        }
        editListener = ({ target}) => {
              let [_, x, y] = target.id.split('-');
              x = +x;
              y = +y;
              if (!isNaN(x) && !isNaN(y)) {
                  const symbols = Object.keys(creatures);
                  const point = new Point(x, y);
                  const cell = this.grid.get(point);
                  const symbol = cell ? getSymbolByCreature(cell) : '';
                  const index = symbols.indexOf(symbol) + 1;
                  cell && this.remove(cell);
                  if (index < symbols.length) {
                      const C = getCreaturesBySymbol(symbols[index]);
                      const creature = new C(point);

                      this.add(point, creature);
                  }
                  this.draw();
               }
        }
        editMode(isEdited) {
            const container = document.querySelector('.terra');
            this.stop;
            if (isEdited) {
                if (this.isEdited) return;
                container.addEventListener('click', this.editListener.bind(this));
            } else {
                container.removeEventListener('click', this.editListener.bind(this));
            }

            this.isEdited = isEdited;
        }

       
}