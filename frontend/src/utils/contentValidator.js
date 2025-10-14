// Content Validation Utility for Eaglonhytes
// Handles profanity filtering and gibberish detection

class ContentValidator {
  constructor() {
    // Comprehensive profanity list (expandable)
    this.profanityList = [
      // Common profanity
      'fuck', 'shit', 'damn', 'hell', 'ass', 'bitch', 'bastard', 'crap',
      'piss', 'cock', 'dick', 'pussy', 'whore', 'slut', 'fag', 'nigger',
      'retard', 'gay', 'lesbian', 'homo', 'queer', 'tranny', 'dyke',
      // Variants and leetspeak
      'f*ck', 'sh*t', 'b*tch', 'a$$', 'f**k', 'sh**', 'f0ck', 'sh1t',
      'b1tch', 'a55', 'fuk', 'sht', 'btch', 'fck', 'shyt', 'azz',
      // Inappropriate terms
      'sex', 'porn', 'xxx', 'nude', 'naked', 'horny', 'sexy', 'orgasm',
      'masturbate', 'penis', 'vagina', 'breast', 'boob', 'tit', 'nipple',
      // Hate speech and offensive terms
      'nazi', 'hitler', 'terrorist', 'bomb', 'kill', 'murder', 'rape',
      'suicide', 'drug', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana',
      // Scam/spam indicators
      'scam', 'fraud', 'fake', 'phishing', 'virus', 'malware', 'hack'
    ];

    // Gibberish patterns
    this.gibberishPatterns = [
      // Repeated characters (3+ times)
      /(.)\1{2,}/g,
      // Random symbols
      /[!@#$%^&*()_+=\[\]{}|;':",./<>?`~]{3,}/g,
      // Mixed case nonsense
      /[A-Z]{3,}[a-z]{1,2}[A-Z]{3,}/g,
      // Number spam
      /\d{5,}/g,
      // Keyboard mashing patterns
      /qwerty|asdf|zxcv|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik|ol|p/gi,
      // Common gibberish patterns
      /aaaa|bbbb|cccc|dddd|eeee|ffff|gggg|hhhh|iiii|jjjj|kkkk|llll|mmmm|nnnn|oooo|pppp|qqqq|rrrr|ssss|tttt|uuuu|vvvv|wwww|xxxx|yyyy|zzzz/gi
    ];

    // Minimum meaningful word length
    this.minWordLength = 2;
    this.maxRepeatedChars = 2;
  }

  // Check if text contains profanity
  containsProfanity(text) {
    if (!text || typeof text !== 'string') return false;
    
    const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanText.split(/\s+/);
    
    for (const word of words) {
      if (this.profanityList.includes(word)) {
        return true;
      }
      
      // Check for profanity with spaces or symbols in between
      for (const profanity of this.profanityList) {
        if (word.includes(profanity) || this.fuzzyMatch(word, profanity)) {
          return true;
        }
      }
    }
    
    return false;
  }

  // Fuzzy matching for profanity with character substitutions
  fuzzyMatch(word, profanity) {
    const substitutions = {
      '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b',
      '@': 'a', '$': 's', '!': 'i', '\\+': 't', '\\|': 'l', '\\(\\)': 'o'
    };
    
    let normalizedWord = word.toLowerCase();
    for (const [symbol, letter] of Object.entries(substitutions)) {
      normalizedWord = normalizedWord.replace(new RegExp(symbol, 'g'), letter);
    }
    
    return normalizedWord.includes(profanity);
  }

  // Check if text is gibberish
  isGibberish(text) {
    if (!text || typeof text !== 'string') return false;
    
    const trimmedText = text.trim();
    
    // Too short to be meaningful
    if (trimmedText.length < 2) return false;
    
    // Check for gibberish patterns
    for (const pattern of this.gibberishPatterns) {
      if (pattern.test(trimmedText)) {
        return true;
      }
    }
    
    // Check for excessive repeated characters
    if (this.hasExcessiveRepeatedChars(trimmedText)) {
      return true;
    }
    
    // Check for lack of vowels (except for abbreviations)
    if (trimmedText.length > 4 && !this.hasVowels(trimmedText)) {
      return true;
    }
    
    // Check for random character sequences
    if (this.isRandomSequence(trimmedText)) {
      return true;
    }
    
    return false;
  }

  // Check for excessive repeated characters
  hasExcessiveRepeatedChars(text) {
    let consecutiveCount = 1;
    let prevChar = '';
    
    for (const char of text.toLowerCase()) {
      if (char === prevChar && /[a-z]/.test(char)) {
        consecutiveCount++;
        if (consecutiveCount > this.maxRepeatedChars) {
          return true;
        }
      } else {
        consecutiveCount = 1;
      }
      prevChar = char;
    }
    
    return false;
  }

  // Check if text has vowels
  hasVowels(text) {
    return /[aeiou]/i.test(text);
  }

  // Check if text appears to be a random sequence
  isRandomSequence(text) {
    const cleanText = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    if (cleanText.length < 4) return false;
    
    // Check consonant to vowel ratio
    const vowels = (cleanText.match(/[aeiou]/g) || []).length;
    const consonants = cleanText.length - vowels;
    
    // If more than 80% consonants, likely gibberish
    if (consonants / cleanText.length > 0.8) {
      return true;
    }
    
    // Check for alternating case patterns that seem random
    let caseChanges = 0;
    for (let i = 1; i < text.length; i++) {
      const curr = text[i];
      const prev = text[i - 1];
      
      if (/[a-zA-Z]/.test(curr) && /[a-zA-Z]/.test(prev)) {
        if ((curr === curr.toUpperCase()) !== (prev === prev.toUpperCase())) {
          caseChanges++;
        }
      }
    }
    
    // If more than 50% case changes, likely gibberish
    return caseChanges > text.length * 0.5;
  }

  // Main validation function
  validateContent(text, fieldName = 'input') {
    if (!text || typeof text !== 'string') {
      return { isValid: true, message: '' };
    }

    const trimmedText = text.trim();
    
    // Allow empty fields (let required validation handle this)
    if (trimmedText === '') {
      return { isValid: true, message: '' };
    }

    // Check for profanity
    if (this.containsProfanity(trimmedText)) {
      return {
        isValid: false,
        message: 'Please enter appropriate and respectful information.'
      };
    }

    // Check for gibberish
    if (this.isGibberish(trimmedText)) {
      return {
        isValid: false,
        message: 'Please enter valid information.'
      };
    }

    return { isValid: true, message: '' };
  }

  // Validate multiple fields at once
  validateFields(fields) {
    const errors = {};
    let hasErrors = false;

    for (const [fieldName, value] of Object.entries(fields)) {
      const result = this.validateContent(value, fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.message;
        hasErrors = true;
      }
    }

    return { isValid: !hasErrors, errors };
  }

  // Real-time validation for input events
  validateInput(inputElement, errorElement = null) {
    const result = this.validateContent(inputElement.value, inputElement.name);
    
    if (!result.isValid) {
      inputElement.classList.add('invalid-content');
      if (errorElement) {
        errorElement.textContent = result.message;
        errorElement.style.display = 'block';
      }
    } else {
      inputElement.classList.remove('invalid-content');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }

    return result.isValid;
  }
}

// Create global instance
const contentValidator = new ContentValidator();

// Export for use in other modules
export default contentValidator;

// Also make it available globally for non-module scripts
if (typeof window !== 'undefined') {
  window.contentValidator = contentValidator;
}
