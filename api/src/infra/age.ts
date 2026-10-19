export const ageOf = (dob: Date) => Math.floor((Date.now() - dob.getTime()) / 31557600000)
