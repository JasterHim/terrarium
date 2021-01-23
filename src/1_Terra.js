class Terra {
    constructor (size, step) {
        this.size = size;
        this.grid = new Grid(size);
        this.step = step;
        this.steps = 0;
        this.creatures =  [];
        Texture.dimensions(15,15);
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

        draw() {
            const container = document.createElement('div');
            const def = new Texture('sand');
            container.className = 'terra';
            let result = '';
            for (let x=0; x<this.grid.width;x++) {
                const row = document.createElement("div");
                for (let y=0; y<this.grid.height;y++){
                   const point = new Point (x, y);
                   const object = this.grid.get(point);

                   row.appendChild(object ? object.draw() : def.render());                     
                } 
                container.appendChild(row);
            }   

            document.body.innerHTML = '';
            document.body.appendChild(container);
        }

        stop() {
            clearInterval(this.interval);
        }
}