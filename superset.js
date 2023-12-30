
class SuperSet {
    constructor(units) {
        this.sets = new Array(units).fill().map(() => new Set())
        this.setSize = Math.pow(2, 27) - 1
    }
    add(item) {
        this.sets.find((set) => set.size < this.setSize).add(item)
    }
    has(item) {
        return this.sets.some((set) => set.has(item))
    }
}

module.exports = SuperSet
