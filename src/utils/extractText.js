function extract(sentence){
    const words = sentence.split(' ')
    const letters = words.map(word => word.toLowerCase().split('')
            .filter(letter => letter !== ',' || letter !== '.' || letter !== '?' || letter !== '!')
        )
    return {
        segment: sentence,
        letters: letters
    }
}

export { extract }
