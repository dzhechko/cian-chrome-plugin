# Cian Deal Analyzer - Chrome Extension PRD

## Overview
Create a Chrome extension called "Cian Deal Analyzer N3" that analyzes property listings on Cian.ru to determine if they are good deals based on the user's income.

## Core Functionality
1. Activates on Cian.ru property listing pages.
2. Extracts Monthly payment from the page.
3. Calculates if the property is a good deal by comparing Monthly payment to Income, which is configured by the user in the plugin popup. A good deal is when Monthly payment is less than Income divided by 3.
4. Displays a "Good Deal" or "Bad Deal" indicator on the page, along with the difference in percentage between Income and Monthly payment.
5. Includes a popup with an "Analyze Deal" button to manually trigger the analysis and an Income input field.
6. Shows the analysis result in the popup, including whether it's a good/bad deal, Monthly payment, Required income, and the percentage between Income and Monthly payment.
7. Automatically runs the analysis when navigating between Cian listing pages.
8. Uses Manifest V3 for the extension.
9. Handles potential changes in Cian's HTML structure by using multiple selectors for key elements.
10. Provides error handling and multiple attempts to find and analyze the required information.

## File Structure
1. manifest.json
   - Contains the extension's metadata and permissions
   - Defines content scripts, background scripts, and popup

2. popup.html
   - The HTML structure for the extension's popup interface
   - Includes input field for user's income
   - Displays "Analyze Deal" button
   - Shows analysis results

3. popup.js
   - Handles the popup's functionality and user interactions
   - Communicates with the content script and background script
   - Stores and retrieves user's income from chrome.storage

4. content.js
   - Interacts with the Cian.ru webpage
   - Extracts Monthly payment and Required income data
   - Modifies the DOM to display deal analysis results
   - Communicates with popup.js and background.js

5. background.js
   - Manages the extension's lifecycle
   - Handles communication between popup and content scripts
   - Listens for tab updates to trigger analysis on page navigation

## Detailed Specifications

### Data Extraction
The extension should extract the following information from Cian.ru listing pages:

1. Monthly payment
   Example HTML:
   ```html
   <span style="letter-spacing:-0.5px" class="a10a3f92e9--color_text-primary-default--vSRPB a10a3f92e9--lineHeight_7u--jtkAy a10a3f92e9--fontWeight_bold--BbhnX a10a3f92e9--fontSize_22px--sFuaL a10a3f92e9--display_block--KYb25 a10a3f92e9--text--e4SBY">65 216<!-- --> ₽</span>
   ```
   Text to extract: "Ежемесячный платеж 65 216 ₽"

2. Required income
   Example HTML:
   ```html
   <span style="letter-spacing:-0.5px" class="a10a3f92e9--color_text-primary-default--vSRPB a10a3f92e9--lineHeight_7u--jtkAy a10a3f92e9--fontWeight_bold--BbhnX a10a3f92e9--fontSize_22px--sFuaL a10a3f92e9--display_block--KYb25 a10a3f92e9--text--e4SBY">108 694<!-- --> ₽</span>
   ```
   Text to extract: "Необходимый доход 108 694 ₽"

### DOM Modification
The extension should add the deal analysis result near the listing title. The target location is next to:

```html
<h1 class="a10a3f92e9--title--vlZwT">Продается 2-комн. апартаменты, 52 м²</h1>
```

### Calculation Logic
1. Good Deal: Monthly payment < (User's Income / 3)
2. Bad Deal: Monthly payment >= (User's Income / 3)
3. Percentage Difference: ((Monthly payment * 3 - User's Income) / User's Income) * 100

### User Interface
1. Popup:
   - Input field for user's income (stored in chrome.storage)
   - "Analyze Deal" button
   - Display area for analysis results:
     - Good Deal / Bad Deal indicator
     - Monthly payment
     - Required income
     - Percentage difference

2. Content Script Injection:
   - Inject a colored badge next to the listing title
   - Green for Good Deal, Red for Bad Deal
   - Display percentage difference

### Error Handling
1. Implement multiple selectors for extracting data to handle potential HTML structure changes
2. Provide fallback mechanisms if primary selectors fail
3. Display user-friendly error messages in the popup if data extraction or analysis fails

### Performance Considerations
1. Minimize DOM manipulation in the content script
2. Use efficient selectors for data extraction
3. Implement debouncing for automatic analysis on page navigation

### Security and Privacy
1. Use content security policy in manifest.json
2. Store user's income securely using chrome.storage.sync
3. Avoid sending sensitive data outside the extension

### Internationalization
1. Support Russian language for extracted data and UI elements
2. Implement i18n support for future language additions

## Communication Flow
1. Background script listens for tab updates
2. On a matching URL, background script sends a message to the content script
3. Content script extracts data and sends it to the popup
4. Popup performs calculations and updates UI
5. User can manually trigger analysis from the popup
6. Popup sends message to content script to update the page with results

## Testing Guidelines
1. Test on various Cian.ru listing pages
2. Verify correct data extraction and calculation
3. Test error handling with modified HTML structure
4. Ensure smooth navigation between listings
5. Verify data persistence of user's income

## Future Enhancements (Out of Scope for Initial Version)
1. Support for multiple real estate websites
2. Advanced filtering options based on deal analysis
3. Historical data tracking for viewed listings
4. Integration with external mortgage calculators

## Additional Requirements and Error Handling

### 1. Proper URL Validation
- Implement strict URL validation to ensure the extension only activates on valid Cian.ru listing pages.
- Use a regex pattern to match Cian.ru listing URLs, e.g., `^https:\/\/.*\.cian\.ru\/.+\/flat\/.+$`
- In the popup.js, before sending the "analyze" message to the content script:
  - Check if the current tab URL matches the Cian.ru listing pattern.
  - If not, display a user-friendly error message: "Пожалуйста, убедитесь, что вы находитесь на странице объявления Cian."
- In the content script, verify the URL again before attempting to extract data.

### 2. Correct Deal Analysis Logic Implementation
- Ensure the deal analysis logic is correctly implemented in both the content script and popup script.
- Clearly define the logic:
  - Good Deal: Monthly payment < (User's Income / 3)
  - Bad Deal: Monthly payment >= (User's Income / 3)
- Implement this logic consistently in both the content script (for page display) and popup script (for popup display).
- Add unit tests to verify the correctness of the deal analysis function.

### 3. Complete Data Display in Popup
- Ensure all relevant data is extracted and passed from the content script to the popup:
  - Monthly payment (Ежемесячный платеж)
  - Required income (Необходимый доход)
  - Deal status (Good/Bad)
  - Percentage difference
- In popup.js, verify that all data is received before updating the UI.
- Implement error handling to show appropriate messages if any data is missing.

### Data Flow and Verification
1. Content Script:
   - Extract all required data (Monthly payment, Required income).
   - Perform initial deal analysis based on user's income (retrieved from chrome.storage).
   - Send complete data object to popup, including raw values and analysis results.

2. Popup Script:
   - Receive data from content script.
   - Verify all expected data fields are present.
   - Re-perform deal analysis to ensure consistency.
   - Display all data fields: Monthly payment, Required income, Deal status, Percentage difference.

### Error Handling and User Feedback
- Implement comprehensive error handling in both content and popup scripts.
- Provide clear, user-friendly error messages for various scenarios:
  - Invalid URL: "Пожалуйста, перейдите на страницу объявления Cian для анализа."
  - Data extraction failure: "Не удалось извлечь данные. Пожалуйста, обновите страницу и попробуйте снова."
  - Incomplete data: "Получены неполные данные. Пожалуйста, проверьте страницу объявления."

### Testing Requirements
- Develop a comprehensive test suite covering:
  - URL validation
  - Data extraction from various Cian.ru listing page layouts
  - Deal analysis logic
  - Data passing between content and popup scripts
  - Error handling scenarios
- Perform manual testing on multiple Cian.ru listings to ensure consistent behavior.

### Logging and Debugging
- Implement detailed logging in both content and popup scripts.
- Log all key steps: URL validation, data extraction, analysis, and data passing.
- In development mode, provide a debug panel in the popup for developers to view logs and current data state.

## Implementation Checklist
To ensure all issues are addressed, developers should:
1. Revise URL validation logic in both popup and content scripts.
2. Review and correct the deal analysis logic implementation.
3. Enhance data extraction in the content script to capture all required fields.
4. Update the popup UI to display all extracted data and analysis results.
5. Implement comprehensive error handling and user feedback mechanisms.
6. Develop and run a thorough test suite covering all scenarios.
7. Conduct a code review focusing on data flow and logic consistency.

By addressing these points, the extension should correctly activate on Cian listing pages, perform accurate deal analysis, and display complete information in both the popup and on the webpage.
