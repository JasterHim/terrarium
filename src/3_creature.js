const selectRandom = (array) => array[
    Math.floor(
        Math.random() * array.length
        )
    ];

class Creature {
    constructor (point) {
        this.coordinates = point;
    }

    action() {
        throw new Error('action not implemented');
    }

    draw() {
        return this.texture.render(this.energy);
    }
    move(terra, point) {
        terra.move(point, this);
        this.coordinates = point;
    }
    consume(object, YIELD) {
        const energy = object.energy - YIELD >= 0 ? YIELD : object.energy;
        object.energy -= energy;
        this.energy += energy;
    }

    getAvailablePoints(terra, distance) {
        const availablePoints = [];

         for (let x=-distance; x<distance+1;x++) {
            for (let y=-distance; y<distance+1;y++){
                const newPoint = this.coordinates.add(new Point (x, y));
                if (terra.grid.isAvailable(newPoint)) {
                    availablePoints.push(newPoint);
                }                     
            } 
        }
        return availablePoints;
    }
    getOccupiedPoints(terra, distance) {
        const occupiedPoints = [];
        
         for (let x=-distance; x<distance+1;x++) {
            for (let y=-distance; y<distance+1;y++){
                const newPoint = this.coordinates.add(new Point (x, y));
                if (!terra.grid.isAvailable(newPoint) && terra.grid.isOnGrid(newPoint)) {
                    occupiedPoints.push(newPoint);
                }                     
            } 
        }
        return occupiedPoints;
    }

    isInDirectCourse(object) {
        const points = [Point.up(), Point.down(), Point.left(), Point.right()] ;

        for (const point of points) {
            if (this.coordinates.add(point).equals(object.coordinates)) {
                return true;
            }
        }
        return false;
    }
}

class Wall extends Creature {
    type = 'wall';
    symbol = '#';
    texture = new Texture('wall');

    action(Terra){

    }
}

class Plant extends Creature {
    type = "plant";
    texture = new Texture ('plant');
    symbol = "*";
    speed = 1;
   

    energy = 20;
   
    action(terra) {
        if (this.energy < 1) return terra.remove(this);
        this.energy += 2;
        if (this.energy > 60) {  
            const availablePoints = this.getAvailablePoints(terra, this.speed);      
           
            const point = selectRandom (availablePoints);
            if (point) {
                const creature = new Plant(point);
                terra.add(point, creature);
                this.energy = 30;
            }            
        }
        if (this.energy > 60) this.energy = 60;
    }
}

class Sheep extends Creature {
    type = 'sheep';
    symbol = '-';
    texture = new Texture('sheep');

    energy = 40;
    speed = 1;
    sight = 2;

    action(terra) {
        this.energy -=3;

        
        const occupied =  this.getOccupiedPoints(terra, this.sight);
        const available = this.getAvailablePoints(terra, this.speed);
        const position = this.coordinates;
        const plants =[];
        const sheep = [];

        for (const point of occupied) {
            const obj = terra.get(point);
            if (obj instanceof Plant) {
                plants.push(obj);
            }
            if (obj instanceof Sheep) {
                sheep.push(obj);
            }
        }

        if (sheep.length && this.energy >= 70) {
            for (const one of sheep) {
                if (this.isInDirectCourse(one) && one.energy >= 60) {
                    return this.multiply(terra, one);
                }
            }
        }

        if (plants.length) {
            for (const plant of plants) {
                if (this.isInDirectCourse(plant)) {
                    return this.consume(plant, 12);
                }
            }
            let closest = plants [0];
            for (const plant of plants) {
                const positionA = plant.coordinates;
                const positionB = closest.coordinates;
                if (positionB.distance(position)<positionA.distance(position)) {
                    closest = plant;
                }
            }
            const plantApproaches = closest.getAvailablePoints(terra, this.speed);
            let secondBest;
            for (const point of plantApproaches) {
                const distance = point.distance(point);

                if (distance === 1) {
                    return this.move(terra, point);
                }

                if (distance === 2 && !secondBest) {
                    secondBest = point;
                }
                
            }
            if (secondBest) {
                return this.move(terra, secondBest);
            }
        }
        if (available.length) {
            const point = selectRandom(available);

            return this.move(terra, point);
        }
    }
   

    
    
    multiply(terra, sheep) {
        const available = sheep.getAvailablePoints(terra, 1);
        if (available.length) {
            const point = selectRandom(available);
            sheep.energy = 40;
            this.energy = 40;
            terra.add(point, new Sheep(point));
        }
    }
}

class Tiger extends Creature {
    type = 'tiger';
    symbol = '+';
    texture = new Texture('tiger');

    energy = 70;
    speed = 2;
    sight = 3;

    action(terra) {
        this.energy -=4;

        
        const occupied =  this.getOccupiedPoints(terra, this.sight);
        const available = this.getAvailablePoints(terra, this.speed);
        const position = this.coordinates;
        const food =[];
        const partners = [];

        for (const point of occupied) {
            const obj = terra.get(point);
            if (obj instanceof Sheep) {
                food.push(obj);
            }
            if (obj instanceof Tiger) {
                partners.push(obj);
            }
        }

        if (partners.length && this.energy >= 110) {
            for (const one of partners) {
                if (this.isInDirectCourse(one) && one.energy >= 100) {
                    return this.multiply(terra, one);
                }
            }
        }
        const isStarving = this.energy <= 120;

        this.speed = isStarving ? 3 : 2;
        this.sight = isStarving ? 5 : 3;

        if (isStarving && food.length) {
            for (const piece of food) {
                if (this.isInDirectCourse(piece)) {
                    return this.consume(piece, 40);
                }
            }
            let closest = food [0];
            for (const piece of food) {
                const positionA = piece.coordinates;
                const positionB = closest.coordinates;
                if (positionB.distance(position)<positionA.distance(position)) {
                    closest = piece;
                }
            }
            const plantApproaches = closest.getAvailablePoints(terra, this.speed);
            let secondBest;
            for (const point of plantApproaches) {
                const distance = point.distance(point);

                if (distance <= 2) {
                    return this.move(terra, point);
                }

                if (distance <= 4 && !secondBest) {
                    secondBest = point;
                }
                
            }
            if (secondBest) {
                return this.move(terra, secondBest);
            }
        }
        if (available.length) {
            const point = selectRandom(available);

            return this.move(terra, point);
        }
    }
   

    
    
    multiply(terra, one) {
        const available = one.getAvailablePoints(terra, 1);
        if (available.length) {
            const point = selectRandom(available);
            one.energy = 65;
            this.energy = 65;
            terra.add(point, new Tiger(point));
        }
    }
}
const creatures = {
    '#' : Wall,
    '*' : Plant,
    '-' : Sheep,
    '+' : Tiger,
};

const getCreaturesBySymbol = (symbol) => creatures [symbol];

const getSymbolByCreature = (creature) => {
    if (creature && creature.type) {
        switch (creature.type) {
            case 'wall':
                return '#';
            case 'plant':
                return '*';
            case 'sheep':
                return '-';
            case 'tiger':
                return '+';
            default:
                break;
                
        }

    }
}