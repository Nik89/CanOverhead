class BitSequence{constructor(e=[],t=!1){this._isStuffed=Boolean(t),this._sequence=[],this.extend(e)}extend(e){if(1===e||!0===e)this._sequence.push(!0);else if(0===e||!1===e)this._sequence.push(!1);else for(let t of e)if("1"===t||!0===t||1===t)this._sequence.push(!0);else if("0"===t||!1===t||0===t)this._sequence.push(!1);else if(""!==t.trim())throw new RangeError("Unsupported character: "+t);return this}length(){return this._sequence.length}equal(e){if(!(e instanceof BitSequence))return!1;if(e._sequence.length!==this._sequence.length)return!1;if(e._isStuffed!==this._isStuffed)return!1;for(let t=0;t<this._sequence.length;t++)if(this._sequence[t]!==e._sequence[t])return!1;return!0}static maxAmountOfStuffBits(e){return e<1?0:Math.floor((e-1)/4)}static maxLengthAfterStuffing(e){return e+this.maxAmountOfStuffBits(e)}exactAmountOfStuffBits(){let e=0,t=1,i=void 0;for(let n of this._sequence)n===i?t++:t=1,5===t?(e++,t=1,i=!n):i=n;return e}exactLengthAfterStuffing(){return this.length()+this.exactAmountOfStuffBits()}applyBitStuffing(){if(this._isStuffed)throw new TypeError("Bits sequence already stuffed.");let e=[],t=1,i=void 0;for(let n of this._sequence)if(n===i?t++:t=1,e.push(n),5===t){let r=!n;e.push(r),t=1,i=r}else i=n;return new BitSequence(e,!0)}toBinString(){let e="";for(let t of this._sequence)e+=t?"1":"0";return e}toBinStringWithSpaces(){let e="",t=this._sequence.length;for(let i of this._sequence)e+=i?"1":"0",--t%4==0&&t>0&&(e+=" ");return e}toHexString(){let e="",t=0,i=0;for(let n=this._sequence.length-1;n>=0;n--)this._sequence[n]&&(t|=1<<i),4===++i&&(e=t.toString(16)+e,i=0,t=0);return i>0&&(e=t.toString(16)+e),e.toUpperCase()}[Symbol.iterator](){return this._sequence.values()}}const idSize={BASE_11_BIT:11,EXTENDED_29_BIT:29},bit={DOMINANT:!1,RECESSIVE:!0},fieldRtr={DATA_FRAME:bit.DOMINANT,RTR_FRAME:bit.RECESSIVE},fieldIde={BASE_11_BIT:bit.DOMINANT,EXTENDED_29_BIT:bit.RECESSIVE},MAX_ID_VALUE_11_BIT=2047,MIN_ID_VALUE=0,MAX_PAYLOAD_BYTES=8;class CanFrame11Bit{constructor(e,t){if("number"!=typeof e)throw new TypeError("Identifier must be a number.");if(e<MIN_ID_VALUE||e>MAX_ID_VALUE_11_BIT)throw new RangeError("Identifier out of bounds.");if(!(t instanceof Uint8Array))throw new TypeError("Payload must be a Uint8Array.");if(t.length>MAX_PAYLOAD_BYTES)throw new RangeError("Payload too long.");this.id=e,this.payload=t}field01_startOfFrame(){return new BitSequence(bit.DOMINANT)}field02_identifier(){return new BitSequence(this.id.toString(2).padStart(idSize.BASE_11_BIT,"0"))}field03_remoteTransmissionRequest(){return new BitSequence(fieldRtr.DATA_FRAME)}field04_identifierExtensionBit(){return new BitSequence(fieldIde.BASE_11_BIT)}field05_reservedBit(){return new BitSequence(bit.DOMINANT)}field06_dataLengthCode(){return new BitSequence(this.payload.length.toString(2).padStart(4,"0"))}field07_dataField(){let e=new BitSequence;for(let t of this.payload)e.extend(t.toString(2).padStart(8,"0"));return e}field08_crc(){let e=new BitSequence;e.extend(this.field01_startOfFrame()),e.extend(this.field02_identifier()),e.extend(this.field03_remoteTransmissionRequest()),e.extend(this.field04_identifierExtensionBit()),e.extend(this.field05_reservedBit()),e.extend(this.field06_dataLengthCode()),e.extend(this.field07_dataField());let t=CanFrame11Bit.crc15(e);return new BitSequence(t.toString(2).padStart(15,"0"))}field09_crcDelimiter(){return new BitSequence(bit.RECESSIVE)}field10_ackSlot(){return new BitSequence(bit.RECESSIVE)}field11_ackDelimiter(){return new BitSequence(bit.RECESSIVE)}field12_endOfFrame(){return new BitSequence([bit.RECESSIVE,bit.RECESSIVE,bit.RECESSIVE,bit.RECESSIVE,bit.RECESSIVE,bit.RECESSIVE,bit.RECESSIVE])}field13_pauseAfterFrame(){return new BitSequence([bit.RECESSIVE,bit.RECESSIVE,bit.RECESSIVE])}wholeFrame(){let e=new BitSequence;return e.extend(this.field01_startOfFrame()),e.extend(this.field02_identifier()),e.extend(this.field03_remoteTransmissionRequest()),e.extend(this.field04_identifierExtensionBit()),e.extend(this.field05_reservedBit()),e.extend(this.field06_dataLengthCode()),e.extend(this.field07_dataField()),e.extend(this.field08_crc()),e.extend(this.field09_crcDelimiter()),e.extend(this.field10_ackSlot()),e.extend(this.field11_ackDelimiter()),e.extend(this.field12_endOfFrame()),e.extend(this.field13_pauseAfterFrame()),e}wholeFrameStuffed(){let e=new BitSequence;return e.extend(this.field01_startOfFrame()),e.extend(this.field02_identifier()),e.extend(this.field03_remoteTransmissionRequest()),e.extend(this.field04_identifierExtensionBit()),e.extend(this.field05_reservedBit()),e.extend(this.field06_dataLengthCode()),e.extend(this.field07_dataField()),e.extend(this.field08_crc()),(e=e.applyBitStuffing()).extend(this.field09_crcDelimiter()),e.extend(this.field10_ackSlot()),e.extend(this.field11_ackDelimiter()),e.extend(this.field12_endOfFrame()),e.extend(this.field13_pauseAfterFrame()),e}maxLengthAfterStuffing(){let e=1;e+=11,e+=1,e+=1,e+=1,e+=4,e+=8*this.payload.length,e+=15;let t=BitSequence.maxLengthAfterStuffing(e);return t+=1,t+=1,t+=1,t+=7,t+=3}static crc15(e){return crc(e,50585,15)}}class CanFrame29Bit{}function crc(e,t,i){let n=0,r=1<<i;t&=~r,r>>=1;for(let s of e)(n^=s<<i-1)&r?n=n<<1^t:n<<=1;return n&(1<<i)-1}function crc17(e){return crc(e,223323,17)}function crc21(e){return crc(e,3156121,21)}