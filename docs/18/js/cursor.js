;(function(){
class IndexCursor {
    OverMethods = { // 端到達時の挙動
        Loop: 'loop', // 同向 & 逆i
        Yoyo: 'yoyo', // 逆向
        Stop: 'stop', // 停止
    }
    Dirs = { // 向き
        Minus: -1, // -
        Plus: 1,   // +
    }
    constructor(l) {
        this._i = 0 // index  添字
        this._l = l // length 長さ
        this._d = 1 // direction 方向
        this._q = 1 // quantity 量
        this._overMethod = IndexCursor.OverMethods.Loop // 端到達時の挙動
    }
    get i( ) { return this._i }
    get fi( ) { return 0 }
    get li( ) { return this._l - 1 }

    get l( ) { return this._i }
    set l(v) { if (v < this._l) { this._i = v }

    get d( ) { return this._d }
    set d(v) { if ([...Object.values(IndexCursor.Dirs)].some(V=>V===v)) { this._d = v }
    get q( ) { return this._q }
    set q(v) { if (Number.isInteger(v) && 0 < v && v < this.l) { this._q = v }

    get overMethod( ) { return this._overMethod }
    set overMethod(v) { if ([...Object.values(IndexCursor.OverMethods)].some(V=>V===v)) { this._overMethod = v }

//    set i(v) { if (0 <= v && v < this._l) { this._i = v } }
    set i(v) {
        //const nextI = this._i + v
        const nextI = v
        if (nextI < this.fi) {
            if (this.fi === this.i) {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.li }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i += (this.q * this.d); }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.fi }
            } else {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.fi }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i = this.fi; }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.fi }
            }
        } else if (this.li < nextI) {
            if (this.li === this.i) {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.fi }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i += (this.q * this.d); }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.li }
            } else {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.li }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i = this.li; }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.li }
            }
        } else { this._i = nextI }
    }
    get #nextI() { return this.i + (this.q * this.d) }
    get #isOverF() { return this.#nextI < this.fi }
    get #isOverL() { return this.li < this.#nextI }
//    get #isF() { return this.i===this.fi }
//    get #isL() { return this.i===this.li }
//    get #isOverF() { return this.#isF && this.d===IndexCursor.Dirs.Minus }
//    get #isOverL() { return this.#isL && this.d===IndexCursor.Dirs.Plus }

    // d方向に進む／d逆方向に進む、マイナス方向へ進む／プラス方向へ進む、指定した量と方向に進む、指定した位置に移動する
    // i++,i--,i+=q,i-=q,i=x
    // i=x:           q=-, d=-
    // i++:           q=1, d=1
    // i--:           q=1, d=-1
    // i+=Q:          q=Q, d=1
    // i-=Q:          q=Q, d=-1
    // next():        q=q, d=d
    // prev():        q=q, d=d*-1
    // moveToPlus():  q=q, d=1
    // moveToMinus(): q=q, d=-1
    next() { this.i += (this.q * this.d) } // 指定した方向と量に従い移動する
    prev() { this.i += (this.q * (this.d * -1)) } // 指定したのと逆方向へ移動する
    moveToPlus() { this.i += (this.q * IndexCursor.Dirs.Plus) }
    moveToMinus() { this.i += (this.q * IndexCursor.Dirs.Minus) }
    /*
    next() {
        if (this.#isOverF) {
            if (this.fi===this.i) {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.li }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i = this.#nextI; }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.fi }
            } else {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.fi }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i = this.fi; }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.fi }
            }
        } else if (this.#isOverL) {
            if (this.li===this.i) {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.fi }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i = this.#nextI; }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.li }
            } else {
                     if (IndexCursor.OverMethods.Loop) { this._i = this.li }
                else if (IndexCursor.OverMethods.Yoyo) { this._d *= -1; this._i = this.li; }
                else if (IndexCursor.OverMethods.Stop) { this._i = this.li }
            }
        } else { this._i = this.#nextI }
    }
    */
}
})();
