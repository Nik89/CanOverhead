/**
 * Returns the maximum amount of stuff bits, given the length of the array of bits
 * @param {number} bits - Length of the array of bits
 * @returns {number} Amount of maximum stuff bits needed for the considered array of bits
 */
let maxAmountOfStuffBits = (amountOfBits) => {
	return Math.floor(amountOfBits / 5);
}

/**
 * Returns the maximum length of the array of bits plus the maximum stuff bits needed, given the length of the array of bits
 * @param {number} bits - Length of the array of bits
 * @returns {number} maximum length of the considered array of bits plus the maximum stuff bits needed
 */
let maxBitsAfterStuffing = (amountOfBits) => {
	return amountOfBits + maxAmountOfStuffBits(amountOfBits);
}

/**
 * Returns the exact amount of stuff bits, given the array of bits
 * Example (using 0 and 1 instead of true and false):
 * 		Input:	11111 0000
 * 		Output:	11111000001		-> 2 bits of stuffing required
 * @param {boolean[]} bits - Array of bits
 * @returns {number} Amount of stuff bits needed for the considered array of bits
 */
let exactAmountOfStuffBits = (bits) => {
	let amountOfStuffBits = 0;
	let repeatedBits = 1;
	let previousBit = undefined;
	for (let bit of bits) {
		if (bit === previousBit) {
			repeatedBits++;
		} else {
			repeatedBits = 1;
		}
		
		if (repeatedBits === 5) {
			amountOfStuffBits++;
			repeatedBits = 1;
			previousBit = !bit;
		} else {
			previousBit = bit;
		}
	}
	
	return amountOfStuffBits;
}

/**
 * Returns the exact amount of stuff bits, given the array of bits
 * Example (using 0 and 1 instead of true and false):
 * 		Input:	11111 0000
 * 		Output:	11111000001
 * @param {boolean[]} bits - Array of bits
 * @returns {number} Amount of stuff bits needed for the considered array of bits
 */
let applyBitStuffing = (bits) => {
	let bitsAfterStuffing = [];

	let repeatedBits = 1;
	let previousBit = undefined;
	for (let bit of bits) {
		if (bit === previousBit) {
			repeatedBits++;
		} else {
			repeatedBits = 1;
		}
		
		if (repeatedBits === 5) {
			repeatedBits = 1;
			bitsAfterStuffing.push(bit);
			bitsAfterStuffing.push(!bit);	// Stuffing bit
			previousBit = !bit;
		} else {
			bitsAfterStuffing.push(bit);
			previousBit = bit;
		}
	}

	return bitsAfterStuffing;
}
