/**
 * @module GoogleTranslateWidget
 */
import Script from 'next/script';

/**
 * A functional component that renders the Google Translate widget.
 * This component is designed to include the Google Translate toolbar into the application, allowing dynamic translation of the webpage content.
 * It uses two `<Script>` tags from Next.js to load and initialize the Google Translate script after the component mounts.
 * 
 * @function
 * @memberOf module:GoogleTranslateWidget
 * @returns {React.Component} A React component that displays the Google Translate widget embedded within the application.
 */
const GoogleTranslateWidget = () => {
    return (
        <div className=' right-0 top-0 bg-white rounded-xl px-2'>
            <div id="google_translate_element"></div>
            <Script
                id="translate1" 
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script id="translate2" strategy="afterInteractive">
                {`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
                }
                `}
            </Script>
        </div>
    );
};

/**
 * React component function that returns a JSX element containing the Google Translate widget.
 * This setup ensures that the Google Translate library is loaded after the component is interactively usable, optimizing performance and user experience.
 * The Google Translate widget is initialized to translate the page content from English.
 * @memberOf module:GoogleTranslateWidget
 */
export default GoogleTranslateWidget;
