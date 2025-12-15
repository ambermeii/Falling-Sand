import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {
                // Fall due to gravity
                let newRow = row + 1;
                // If nothing below move down
                if (!moveParticle(row, col, newRow, col)) {
                    // Try to move left
                    if (!moveParticle(row, col, newRow, col-1, this.swap)) {
                        moveParticle(row, col, newRow, col+1, this.swap)
                }
            }
        }

    }

/**
 * Sand particle
 */
// Extend ells JavaScript that the Sand class inherits from the Particle
// class. This means that the Sand class automatically gets the color, type,
// swap, and update properties and methods from the Particle class.
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        return other.type === "water";
    }

    update(row, col) {
        moveParticle(row, col, row+1, col, this.swap);
    }
}
// Stone Particle

export class Stone extends Particle {
    constructor() {
        super(); // Call the constructor of the Particle class
        this.color = "gray";
        this.type = "stone";
    }
}

// Dirt Particle
export class Dirt extends Particle {
    constructor() {
        // Call constructor of sand class
        super();
        this.color = "brown";
        this.type = "dirt";
        this.wet = false;
    }
    update(row, col) {
        // Turn into grass if its wet
        if (this.wet) {
            setParticle(row, col, new Grass());
            return;
        }
        // Dirt falls only if empty below
        if (!getParticle(row + 1, col)) {
            moveParticle(row, col, row + 1, col)
        }
    }

}

// Cloud Particle
export class Cloud extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "cloud";
    }

    update(row, col) {
        const below = getParticle(row + 1,col);
        if ( below?.type === "dirt") {
            below.wet = true;
            setParticle(row, col, null)
            return;
        }
        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, super.swap);
        } 
            
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
        else if (!getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
            }
        }
}

// Water class
export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        const below = getParticle(row + 1, col);
        if (below?.type == "dirt") {
            // Remove water and change dirt to grass
            below.wet = true;
            setParticle(row, col, null);
            return;
        }
        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, this.swap);
        } 
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, this.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, this.swap);
        }
    }
}

export class Grass extends Particle {
    constructor() {
        super();
        this.color = "green";
        this.type = "grass";
    }

    update(row,col) {
        return;
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } else if (value == "Water") {
        return new Water();
    } else if (value == "Stone") { // Add this
        return new Stone();
    } else if (value == "Dirt") {   // Add this
        return new Dirt();
    } else if (value == "Cloud") {
        return new Cloud();
    }
    else if(value == "Grass") {
        return new Grass()
    }
    return null;
}