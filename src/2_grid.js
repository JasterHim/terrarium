class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    minus(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    distance(point) {
        const newPoint = this.minus(point);

        return Math.abs(newPoint.x) + Math.abs(newPoint.y);
    }
    equals(point) {
        return this.x === point.x && this.y === point.y;
    }

    static up() {
        return new Point (0, -1);
    }
    static down() {
        return new Point (0, 1);
    }
    static left() {
        return new Point (-1, 0);
    }
    static right() {
        return new Point (1, 0);
    }
}

class Grid {
    constructor(size) {
        this.width = size;
        this.height = size;
        this.grid = new Array(size ** 2).fill(null);
    }
    getIndexOfPoint(point) {
        const isOnGrid = point 
        && point.x > -1 
        && point.x < this.width
        && point.y > -1 
        && point.y < this.height;
        //console.log(point, isOnGrid);
        if (!isOnGrid) {
            throw new Error('Point is not on grid x:' + point.x + ' y: ' + point.y) ;
        }
        return this.width * point.y + point.x;
    }

    isOnGrid(point) {
        return point 
        && point.x > -1 
        && point.x < this.width
        && point.y > -1 
        && point.y < this.height;
    }
    isAvailable(point) {
        const isOnGrid = this.isOnGrid(point);
        if (!isOnGrid)  return false;
        const index = this.getIndexOfPoint(point);
        return this.grid[index] === null;
        }

    place(point, object) {
        //console.log(point);
        const index = this.getIndexOfPoint(point);
        if (this.grid[index] !== null) {
            throw new Error('This point is occupid');
        }
        this.grid[index] = object;

    }

    get(point) {
        const index = this.getIndexOfPoint(point);
        return this.grid[index];
    }

    remove(point) {
        const index = this.getIndexOfPoint(point);
        this.grid[index] = null;
    }
}