# Dictionary mapping characters to Morse code
MORSE_CODE_DICT = { 'A':'.-', 'B':'-...', 'C':'-.-.', 'D':'-..', 'E':'.', 'F':'..-.',
                    'G':'--.', 'H':'....', 'I':'..', 'J':'.---', 'K':'-.-', 'L':'.-..',
                    'M':'--', 'N':'-.', 'O':'---', 'P':'.--.', 'Q':'--.-', 'R':'.-.',
                    'S':'...', 'T':'-', 'U':'..-', 'V':'...-', 'W':'.--', 'X':'-..-',
                    'Y':'-.--', 'Z':'--..', '1':'.----', '2':'..---', '3':'...--',
                    '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..',
                    '9':'----.', '0':'-----', ', ':'--..--', '.':'.-.-.-', '?':'..--..',
                    '/':'-..-.', '-':'-....-', '(':'-.--.', ')':'-.--.-', ' ': '/' }

def encrypt(message):
    cipher = ''
    for letter in message.upper():
        if letter != ' ':
            # Look up the dictionary and add a space to separate morse characters
            cipher += MORSE_CODE_DICT[letter] + ' '
        else:
            # Add a slash or extra space to separate words
            cipher += '/ '
    return cipher.strip()

def decrypt(message):
    # Reverse the dictionary for decoding
    decipher_dict = {value: key for key, value in MORSE_CODE_DICT.items()}
    message += ' '
    decipher = ''
    citext = ''
    for letter in message:
        if letter != ' ':
            citext += letter
        else:
            if citext:
                decipher += decipher_dict.get(citext, '')
                citext = ''
    return decipher

# Usage
msg = ".- .- .- .-"
encoded = encrypt(msg)
print(f"Encoded: {encoded}")
print(f"Decoded: {decrypt(encoded)}")
