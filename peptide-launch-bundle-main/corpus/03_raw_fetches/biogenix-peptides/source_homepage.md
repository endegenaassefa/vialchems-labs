---
url: https://biogenixpeptides.com
fetched_at: 2026-05-07T19:48:02Z
fetch_method: curl
http_status: 200
sha256: 7341e5a30ecfbd1b8790767c1346a7a58f179b86d2c4cd524516281c0b0b21bb
---

 
<!DOCTYPE html>
<html class="no-js" lang="en-US">
<head>
    <meta charset="UTF-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	        <div class="page-loader" id="loading-state">
            <div class="loader-spinner"></div>
        </div>
        <style>
            #loading-state {
                display: none;
            }
            .google-pay-button {
                width: 100% !important;
                margin: 10px 0px;
            }
        </style>
                <script id="gpayftd" src="https://payment.ipospays.com/ftd/v1/gpay.js"></script>
        <script id="applepayftd" src="https://payment.ipospays.com/ftd/v1/ipospays-apple-pay.js"></script>
        <script>
            var gPayCartData = null;
            var storeDBA = "VITAL SIGNS DEFENDER GRA";
            var isUserLoggedIn = false;
            var tpn = "";
            // console.log("gPayCartData",gPayCartData);
            if (gPayCartData && isUserLoggedIn) {
                let orderForPayTransactionInfo = {
                    countryCode: gPayCartData.country,
                    currencyCode: gPayCartData.currency,
                    totalPriceStatus: "FINAL",
                    totalPriceLabel: `Pay ${storeDBA}`,
                    totalPrice: parseFloat(gPayCartData.total).toFixed(2),
                };

                // console.log("orderForPayTransactionInfo", orderForPayTransactionInfo);
                
                const merchantId = "";
                const appleMerchantId = "921925276448";
                const Mode = "PRODUCTION";

                const buttonStyles = {
                    buttonColor: "default",
                    buttonType: "plain",
                    buttonRadius: "4px",
                    buttonLocale: "en",
                    buttonHeight: "40px",
                    buttonWidth: "240px"
                };

                // console.log(orderForPayTransactionInfo, merchantId, Mode, buttonStyles);

                document.addEventListener("DOMContentLoaded", function () {
                    if (document.getElementById("ipospays-gpay-btn")) {
                        const goolePayFelids = {
                            requestBillingAddress: gPayCartData.isBillingRequired,
                            requestPayerEmail: gPayCartData.isEmailRequired,
                            requestPayerPhone: gPayCartData.isPhoneRequired,
                            requestShipping: gPayCartData.isShippingRequired,
                        };
                        initializeGooglePay(orderForPayTransactionInfo, merchantId, Mode, buttonStyles, goolePayFelids);
                    }
                });

                document.addEventListener("DOMContentLoaded", function () {
                    if (document.getElementById("ipospays-apple-pay-button")) {
                        const applePayFelids = {
                            requestBillingAddress: gPayCartData.isBillingRequired,
                            requestPayerEmail: gPayCartData.isEmailRequired,
                            requestPayerPhone: gPayCartData.isPhoneRequired,
                            requestShipping: gPayCartData.isShippingRequired,
                            requestPayerName: false
                        };

                        // Update label dynamically
                        orderForPayTransactionInfo = {
                            ...orderForPayTransactionInfo,
                            totalPriceLabel: storeDBA
                        };
                        const applePayButtonStyles = {
                            buttonColor: "default",
                            buttonType: "plain",
                            buttonRadius: "4" + "px",
                            buttonLocale: "en",
                            buttonHeight: "40" + "px",
                            buttonWidth: "240" + "px"
                        };
                        initializeApplePay(orderForPayTransactionInfo, applePayButtonStyles, appleMerchantId, applePayFelids);
                    }
                });
                
            }

            // function getPaymentToken(token) {
            //     // console.log("Received Payment Token: ", JSON.stringify(token));

            //     document.getElementById('loading-state').style.display = "flex";
            //     jQuery.ajax({
            //         url: 'https://biogenixpeptides.com/wp-admin/admin-ajax.php',
            //         type: 'POST',
            //         data: {
            //             action: 'ipospays_gpay_process',
            //             payment_token: JSON.stringify(token),
            //             order_id: gPayCartData.id
            //         },
            //         success: function (response) {
            //             if (response.success) {
            //                 // console.log('Payment Successful:', response);
            //                 document.getElementById('loading-state').style.display = "none";
            //                 window.location.href = response.data.redirect;
            //             } else {
            //                 document.getElementById('loading-state').style.display = "none";
            //                 window.location.reload();
            //                 console.error('Payment Failed:', response);
            //             }
            //         },
            //         error: function (xhr, status, error) {
            //             document.getElementById('loading-state').style.display = "none";
            //             window.location.reload();
            //             console.error('AJAX Request Error:', status, error);
            //         }
            //     });
            // }

            function getPaymentInfo(paymentData) {
                // console.log("Received Payment Token: ", JSON.stringify(paymentData));
                const encodedPaymentData = btoa(unescape(encodeURIComponent(JSON.stringify(paymentData))));

                document.getElementById('loading-state').style.display = "flex";
                jQuery.ajax({
                    url: 'https://biogenixpeptides.com/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'ipospays_gpay_process',
                        payment_token: encodedPaymentData,
                        order_id: gPayCartData.id,
                        paymentDataInfo: encodedPaymentData,
                        isGooglePay: true,
                        isApplePay: false
                    },
                    success: function (response) {
                        if (response.success) {
                            // console.log('Payment Successful:', response);
                            document.getElementById('loading-state').style.display = "none";
                            window.location.href = response.data.redirect;
                        } else {
                            document.getElementById('loading-state').style.display = "none";
                            window.location.reload();
                            console.error('Payment Failed:', response);
                        }
                    },
                    error: function (xhr, status, error) {
                        document.getElementById('loading-state').style.display = "none";
                        window.location.reload();
                        console.error('AJAX Request Error:', status, error);
                    }
                });
            }

            function getApplePaymentInfo(paymentData) {
                // console.log("paymentData", paymentData);
                
                // Normalize Apple Pay structure for all browsers
                let appleResponse = {};

                // This is where you are probably logging (too early)
                // console.log("Logging appleResponse:", appleResponse); // <-- This will always show {}

                // --- CORRECTED CHECK ---
                if (
                    paymentData &&
                    typeof paymentData === "object" &&
                    paymentData.methodName === "https://apple.com/apple-pay"
                ) {
                    // Safari (response is nested)
                    if (paymentData.PaymentResponse && paymentData.PaymentResponse.details) {
                    appleResponse = paymentData.PaymentResponse;
                    } 
                    // Chrome / other (response is flat)
                    else {
                    appleResponse = paymentData;
                    }
                }

                // --- !! THIS IS THE CORRECT PLACE TO LOG !! ---
                // We log *after* the object has been assigned.
                // And we log specific properties to get an accurate snapshot.

                // console.log("--- APPLE PAY DEBUG LOG ---");
                // console.log("Is appleResponse an object?", typeof appleResponse === "object" && !!appleResponse);
                // console.log("appleResponse.methodName:", appleResponse.methodName);
                // console.log("Does appleResponse.details exist?", !!appleResponse.details);
                
                // --- Your validation check ---
                if (!appleResponse || !appleResponse.details) {
                    console.error("Apple Pay payment data is empty or missing 'details'.");
                    // console.log("This is the 'paymentData' object that failed:", paymentData); // Log the original
                    return; // stop execution
                }

                // If you reach this point, your validation passed.
                // console.log("✅ Validation Passed! Normalized Apple Pay Data:", appleResponse);

                const encodedPaymentData = btoa(unescape(encodeURIComponent(JSON.stringify(paymentData))));

                document.getElementById('loading-state').style.display = "flex";
                jQuery.ajax({
                    url: 'https://biogenixpeptides.com/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'ipospays_applepay_process',
                        payment_token: encodedPaymentData,
                        order_id: gPayCartData.id,
                        paymentDataInfo: encodedPaymentData,
                        isGooglePay: false,
                        isApplePay: true
                    },
                    success: function (response) {
                        if (response.success) {
                            // console.log('Payment Successful:', response);
                            document.getElementById('loading-state').style.display = "none";
                            window.location.href = response.data.redirect;
                        } else {
                            document.getElementById('loading-state').style.display = "none";
                            window.location.reload();
                            console.error('Payment Failed:', response);
                        }
                    },
                    error: function (xhr, status, error) {
                        document.getElementById('loading-state').style.display = "none";
                        window.location.reload();
                        console.error('AJAX Request Error:', status, error);
                    }
                });
            }

        </script>
                <div class="page-loader" id="loading-state">
            <div class="loader-spinner"></div>
        </div>
        <style>
            #loading-state {
                display: none;
            }
            .google-pay-button {
                width: 100% !important;
                margin: 10px 0px;
            }
        </style>
                <script id="gpayftd" src="https://payment.ipospays.com/ftd/v1/gpay.js"></script>
        <script id="applepayftd" src="https://payment.ipospays.com/ftd/v1/ipospays-apple-pay.js"></script>
        <script>
            var gPayCartData = null;
            var storeDBA = "VITAL SIGNS DEFENDER GRA";
            var isUserLoggedIn = false;
            var tpn = "";
            // console.log("gPayCartData",gPayCartData);
            if (gPayCartData && isUserLoggedIn) {
                let orderForPayTransactionInfo = {
                    countryCode: gPayCartData.country,
                    currencyCode: gPayCartData.currency,
                    totalPriceStatus: "FINAL",
                    totalPriceLabel: `Pay ${storeDBA}`,
                    totalPrice: parseFloat(gPayCartData.total).toFixed(2),
                };

                // console.log("orderForPayTransactionInfo", orderForPayTransactionInfo);
                
                const merchantId = "";
                const appleMerchantId = "921925276448";
                const Mode = "PRODUCTION";

                const buttonStyles = {
                    buttonColor: "default",
                    buttonType: "plain",
                    buttonRadius: "4px",
                    buttonLocale: "en",
                    buttonHeight: "40px",
                    buttonWidth: "240px"
                };

                // console.log(orderForPayTransactionInfo, merchantId, Mode, buttonStyles);

                document.addEventListener("DOMContentLoaded", function () {
                    if (document.getElementById("ipospays-gpay-btn")) {
                        const goolePayFelids = {
                            requestBillingAddress: gPayCartData.isBillingRequired,
                            requestPayerEmail: gPayCartData.isEmailRequired,
                            requestPayerPhone: gPayCartData.isPhoneRequired,
                            requestShipping: gPayCartData.isShippingRequired,
                        };
                        initializeGooglePay(orderForPayTransactionInfo, merchantId, Mode, buttonStyles, goolePayFelids);
                    }
                });

                document.addEventListener("DOMContentLoaded", function () {
                    if (document.getElementById("ipospays-apple-pay-button")) {
                        const applePayFelids = {
                            requestBillingAddress: gPayCartData.isBillingRequired,
                            requestPayerEmail: gPayCartData.isEmailRequired,
                            requestPayerPhone: gPayCartData.isPhoneRequired,
                            requestShipping: gPayCartData.isShippingRequired,
                            requestPayerName: false
                        };

                        // Update label dynamically
                        orderForPayTransactionInfo = {
                            ...orderForPayTransactionInfo,
                            totalPriceLabel: storeDBA
                        };
                        const applePayButtonStyles = {
                            buttonColor: "default",
                            buttonType: "plain",
                            buttonRadius: "4" + "px",
                            buttonLocale: "en",
                            buttonHeight: "40" + "px",
                            buttonWidth: "240" + "px"
                        };
                        initializeApplePay(orderForPayTransactionInfo, applePayButtonStyles, appleMerchantId, applePayFelids);
                    }
                });
                
            }

            // function getPaymentToken(token) {
            //     // console.log("Received Payment Token: ", JSON.stringify(token));

            //     document.getElementById('loading-state').style.display = "flex";
            //     jQuery.ajax({
            //         url: 'https://biogenixpeptides.com/wp-admin/admin-ajax.php',
            //         type: 'POST',
            //         data: {
            //             action: 'ipospays_gpay_process',
            //             payment_token: JSON.stringify(token),
            //             order_id: gPayCartData.id
            //         },
            //         success: function (response) {
            //             if (response.success) {
            //                 // console.log('Payment Successful:', response);
            //                 document.getElementById('loading-state').style.display = "none";
            //                 window.location.href = response.data.redirect;
            //             } else {
            //                 document.getElementById('loading-state').style.display = "none";
            //                 window.location.reload();
            //                 console.error('Payment Failed:', response);
            //             }
            //         },
            //         error: function (xhr, status, error) {
            //             document.getElementById('loading-state').style.display = "none";
            //             window.location.reload();
            //             console.error('AJAX Request Error:', status, error);
            //         }
            //     });
            // }

            function getPaymentInfo(paymentData) {
                // console.log("Received Payment Token: ", JSON.stringify(paymentData));
                const encodedPaymentData = btoa(unescape(encodeURIComponent(JSON.stringify(paymentData))));

                document.getElementById('loading-state').style.display = "flex";
                jQuery.ajax({
                    url: 'https://biogenixpeptides.com/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'ipospays_gpay_process',
                        payment_token: encodedPaymentData,
                        order_id: gPayCartData.id,
                        paymentDataInfo: encodedPaymentData,
                        isGooglePay: true,
                        isApplePay: false
                    },
                    success: function (response) {
                        if (response.success) {
                            // console.log('Payment Successful:', response);
                            document.getElementById('loading-state').style.display = "none";
                            window.location.href = response.data.redirect;
                        } else {
                            document.getElementById('loading-state').style.display = "none";
                            window.location.reload();
                            console.error('Payment Failed:', response);
                        }
                    },
                    error: function (xhr, status, error) {
                        document.getElementById('loading-state').style.display = "none";
                        window.location.reload();
                        console.error('AJAX Request Error:', status, error);
                    }
                });
            }

            function getApplePaymentInfo(paymentData) {
                // console.log("paymentData", paymentData);
                
                // Normalize Apple Pay structure for all browsers
                let appleResponse = {};

                // This is where you are probably logging (too early)
                // console.log("Logging appleResponse:", appleResponse); // <-- This will always show {}

                // --- CORRECTED CHECK ---
                if (
                    paymentData &&
                    typeof paymentData === "object" &&
                    paymentData.methodName === "https://apple.com/apple-pay"
                ) {
                    // Safari (response is nested)
                    if (paymentData.PaymentResponse && paymentData.PaymentResponse.details) {
                    appleResponse = paymentData.PaymentResponse;
                    } 
                    // Chrome / other (response is flat)
                    else {
                    appleResponse = paymentData;
                    }
                }

                // --- !! THIS IS THE CORRECT PLACE TO LOG !! ---
                // We log *after* the object has been assigned.
                // And we log specific properties to get an accurate snapshot.

                // console.log("--- APPLE PAY DEBUG LOG ---");
                // console.log("Is appleResponse an object?", typeof appleResponse === "object" && !!appleResponse);
                // console.log("appleResponse.methodName:", appleResponse.methodName);
                // console.log("Does appleResponse.details exist?", !!appleResponse.details);
                
                // --- Your validation check ---
                if (!appleResponse || !appleResponse.details) {
                    console.error("Apple Pay payment data is empty or missing 'details'.");
                    // console.log("This is the 'paymentData' object that failed:", paymentData); // Log the original
                    return; // stop execution
                }

                // If you reach this point, your validation passed.
                // console.log("✅ Validation Passed! Normalized Apple Pay Data:", appleResponse);

                const encodedPaymentData = btoa(unescape(encodeURIComponent(JSON.stringify(paymentData))));

                document.getElementById('loading-state').style.display = "flex";
                jQuery.ajax({
                    url: 'https://biogenixpeptides.com/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'ipospays_applepay_process',
                        payment_token: encodedPaymentData,
                        order_id: gPayCartData.id,
                        paymentDataInfo: encodedPaymentData,
                        isGooglePay: false,
                        isApplePay: true
                    },
                    success: function (response) {
                        if (response.success) {
                            // console.log('Payment Successful:', response);
                            document.getElementById('loading-state').style.display = "none";
                            window.location.href = response.data.redirect;
                        } else {
                            document.getElementById('loading-state').style.display = "none";
                            window.location.reload();
                            console.error('Payment Failed:', response);
                        }
                    },
                    error: function (xhr, status, error) {
                        document.getElementById('loading-state').style.display = "none";
                        window.location.reload();
                        console.error('AJAX Request Error:', status, error);
                    }
                });
            }

        </script>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />

	<!-- This site is optimized with the Yoast SEO plugin v27.5 - https://yoast.com/product/yoast-seo-wordpress/ -->
	<title>Research Grade Peptides | Ultra-Pure Peptide Supplier – BioGenix</title>
	<meta name="description" content="Shop research grade peptides from BioGenix. Ultra-pure peptide products with strict quality control, transparency, and fast U.S. shipping." />
	<link rel="canonical" href="https://biogenixpeptides.com/" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Research Grade Peptides | Ultra-Pure Peptide Supplier – BioGenix" />
	<meta property="og:description" content="Shop research grade peptides from BioGenix. Ultra-pure peptide products with strict quality control, transparency, and fast U.S. shipping." />
	<meta property="og:url" content="https://biogenixpeptides.com/" />
	<meta property="og:site_name" content="BioGenix Peptides™" />
	<meta property="article:publisher" content="https://facebook.com/BioGenixPeptides/" />
	<meta property="article:modified_time" content="2026-04-29T11:49:35+00:00" />
	<meta property="og:image" content="https://biogenixpeptides.com/wp-content/uploads/2026/03/Home-page-slider-1.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<script type="application/ld+json" class="yoast-schema-graph">{"@context":"https:\/\/schema.org","@graph":[{"@type":"WebPage","@id":"https:\/\/biogenixpeptides.com\/","url":"https:\/\/biogenixpeptides.com\/","name":"Research Grade Peptides | Ultra-Pure Peptide Supplier – BioGenix","isPartOf":{"@id":"https:\/\/biogenixpeptides.com\/#website"},"about":{"@id":"https:\/\/biogenixpeptides.com\/#organization"},"primaryImageOfPage":{"@id":"https:\/\/biogenixpeptides.com\/#primaryimage"},"image":{"@id":"https:\/\/biogenixpeptides.com\/#primaryimage"},"thumbnailUrl":"https:\/\/biogenixpeptides.com\/wp-content\/uploads\/2026\/03\/Home-page-slider-1.png","datePublished":"2020-09-11T06:27:32+00:00","dateModified":"2026-04-29T11:49:35+00:00","description":"Shop research grade peptides from BioGenix. Ultra-pure peptide products with strict quality control, transparency, and fast U.S. shipping.","breadcrumb":{"@id":"https:\/\/biogenixpeptides.com\/#breadcrumb"},"inLanguage":"en-US","potentialAction":[{"@type":"ReadAction","target":["https:\/\/biogenixpeptides.com\/"]}]},{"@type":"ImageObject","inLanguage":"en-US","@id":"https:\/\/biogenixpeptides.com\/#primaryimage","url":"https:\/\/biogenixpeptides.com\/wp-content\/uploads\/2026\/03\/Home-page-slider-1.png","contentUrl":"https:\/\/biogenixpeptides.com\/wp-content\/uploads\/2026\/03\/Home-page-slider-1.png","width":700,"height":967},{"@type":"BreadcrumbList","@id":"https:\/\/biogenixpeptides.com\/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home"}]},{"@type":"WebSite","@id":"https:\/\/biogenixpeptides.com\/#website","url":"https:\/\/biogenixpeptides.com\/","name":"BioGenix Peptides™","description":"Research Grade Peptides","publisher":{"@id":"https:\/\/biogenixpeptides.com\/#organization"},"potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https:\/\/biogenixpeptides.com\/?s={search_term_string}"},"query-input":{"@type":"PropertyValueSpecification","valueRequired":true,"valueName":"search_term_string"}}],"inLanguage":"en-US"},{"@type":"Organization","@id":"https:\/\/biogenixpeptides.com\/#organization","name":"BioGenix Peptides™","url":"https:\/\/biogenixpeptides.com\/","logo":{"@type":"ImageObject","inLanguage":"en-US","@id":"https:\/\/biogenixpeptides.com\/#\/schema\/logo\/image\/","url":"https:\/\/biogenixpeptides.com\/wp-content\/uploads\/2025\/11\/BioGenix_Peptides_Logo_Primary_1.png","contentUrl":"https:\/\/biogenixpeptides.com\/wp-content\/uploads\/2025\/11\/BioGenix_Peptides_Logo_Primary_1.png","width":1835,"height":590,"caption":"BioGenix Peptides™"},"image":{"@id":"https:\/\/biogenixpeptides.com\/#\/schema\/logo\/image\/"},"sameAs":["https:\/\/facebook.com\/BioGenixPeptides\/","https:\/\/www.instagram.com\/biogenixpeptides\/"]}]}</script>
	<!-- / Yoast SEO plugin. -->


<script type='application/javascript'  id='pys-version-script'>console.log('PixelYourSite Free version 11.2.0.4');</script>
<link rel='dns-prefetch' href='//widget.trustpilot.com' />
<link rel='dns-prefetch' href='//fonts.googleapis.com' />
<link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://biogenixpeptides.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fbiogenixpeptides.com%2F" />
<link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="https://biogenixpeptides.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fbiogenixpeptides.com%2F&#038;format=xml" />
<style id='wp-img-auto-sizes-contain-inline-css' type='text/css'>
img:is([sizes=auto i],[sizes^="auto," i]){contain-intrinsic-size:3000px 1500px}
/*# sourceURL=wp-img-auto-sizes-contain-inline-css */
</style>
<link rel='stylesheet' id='sbi_styles-css' href='https://biogenixpeptides.com/wp-content/plugins/instagram-feed/css/sbi-styles.min.css?ver=6.10.1' type='text/css' media='all' />
<style id='classic-theme-styles-inline-css' type='text/css'>
/*! This file is auto-generated */
.wp-block-button__link{color:#fff;background-color:#32373c;border-radius:9999px;box-shadow:none;text-decoration:none;padding:calc(.667em + 2px) calc(1.333em + 2px);font-size:1.125em}.wp-block-file__button{background:#32373c;color:#fff;text-decoration:none}
/*# sourceURL=/wp-includes/css/classic-themes.min.css */
</style>
<link rel='stylesheet' id='amazon-payments-advanced-blocks-log-out-banner-css' href='https://biogenixpeptides.com/wp-content/plugins/woocommerce-gateway-amazon-payments-advanced/build/js/blocks/log-out-banner/style-index.css?ver=7b7a8388c5cd363f116c' type='text/css' media='all' />
<style id='global-styles-inline-css' type='text/css'>
:root{--wp--preset--aspect-ratio--square: 1;--wp--preset--aspect-ratio--4-3: 4/3;--wp--preset--aspect-ratio--3-4: 3/4;--wp--preset--aspect-ratio--3-2: 3/2;--wp--preset--aspect-ratio--2-3: 2/3;--wp--preset--aspect-ratio--16-9: 16/9;--wp--preset--aspect-ratio--9-16: 9/16;--wp--preset--color--black: #000000;--wp--preset--color--cyan-bluish-gray: #abb8c3;--wp--preset--color--white: #ffffff;--wp--preset--color--pale-pink: #f78da7;--wp--preset--color--vivid-red: #cf2e2e;--wp--preset--color--luminous-vivid-orange: #ff6900;--wp--preset--color--luminous-vivid-amber: #fcb900;--wp--preset--color--light-green-cyan: #7bdcb5;--wp--preset--color--vivid-green-cyan: #00d084;--wp--preset--color--pale-cyan-blue: #8ed1fc;--wp--preset--color--vivid-cyan-blue: #0693e3;--wp--preset--color--vivid-purple: #9b51e0;--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%);--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgb(252,185,0) 0%,rgb(255,105,0) 100%);--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgb(255,105,0) 0%,rgb(207,46,46) 100%);--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);--wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);--wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);--wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);--wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);--wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);--wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);--wp--preset--font-size--small: 13px;--wp--preset--font-size--medium: 20px;--wp--preset--font-size--large: 36px;--wp--preset--font-size--x-large: 42px;--wp--preset--spacing--20: 0.44rem;--wp--preset--spacing--30: 0.67rem;--wp--preset--spacing--40: 1rem;--wp--preset--spacing--50: 1.5rem;--wp--preset--spacing--60: 2.25rem;--wp--preset--spacing--70: 3.38rem;--wp--preset--spacing--80: 5.06rem;--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);--wp--preset--shadow--outlined: 6px 6px 0px -3px rgb(255, 255, 255), 6px 6px rgb(0, 0, 0);--wp--preset--shadow--crisp: 6px 6px 0px rgb(0, 0, 0);}:where(.is-layout-flex){gap: 0.5em;}:where(.is-layout-grid){gap: 0.5em;}body .is-layout-flex{display: flex;}.is-layout-flex{flex-wrap: wrap;align-items: center;}.is-layout-flex > :is(*, div){margin: 0;}body .is-layout-grid{display: grid;}.is-layout-grid > :is(*, div){margin: 0;}:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}:where(.wp-block-post-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-post-template.is-layout-grid){gap: 1.25em;}.has-black-color{color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-color{color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-color{color: var(--wp--preset--color--white) !important;}.has-pale-pink-color{color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-color{color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-color{color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-color{color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-color{color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-color{color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-color{color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-color{color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-color{color: var(--wp--preset--color--vivid-purple) !important;}.has-black-background-color{background-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-background-color{background-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-background-color{background-color: var(--wp--preset--color--white) !important;}.has-pale-pink-background-color{background-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-background-color{background-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-background-color{background-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-background-color{background-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-background-color{background-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-background-color{background-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-background-color{background-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-background-color{background-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-background-color{background-color: var(--wp--preset--color--vivid-purple) !important;}.has-black-border-color{border-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-border-color{border-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-border-color{border-color: var(--wp--preset--color--white) !important;}.has-pale-pink-border-color{border-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-border-color{border-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-border-color{border-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-border-color{border-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-border-color{border-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-border-color{border-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-border-color{border-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-border-color{border-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-border-color{border-color: var(--wp--preset--color--vivid-purple) !important;}.has-vivid-cyan-blue-to-vivid-purple-gradient-background{background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;}.has-light-green-cyan-to-vivid-green-cyan-gradient-background{background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;}.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;}.has-luminous-vivid-orange-to-vivid-red-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;}.has-very-light-gray-to-cyan-bluish-gray-gradient-background{background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;}.has-cool-to-warm-spectrum-gradient-background{background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;}.has-blush-light-purple-gradient-background{background: var(--wp--preset--gradient--blush-light-purple) !important;}.has-blush-bordeaux-gradient-background{background: var(--wp--preset--gradient--blush-bordeaux) !important;}.has-luminous-dusk-gradient-background{background: var(--wp--preset--gradient--luminous-dusk) !important;}.has-pale-ocean-gradient-background{background: var(--wp--preset--gradient--pale-ocean) !important;}.has-electric-grass-gradient-background{background: var(--wp--preset--gradient--electric-grass) !important;}.has-midnight-gradient-background{background: var(--wp--preset--gradient--midnight) !important;}.has-small-font-size{font-size: var(--wp--preset--font-size--small) !important;}.has-medium-font-size{font-size: var(--wp--preset--font-size--medium) !important;}.has-large-font-size{font-size: var(--wp--preset--font-size--large) !important;}.has-x-large-font-size{font-size: var(--wp--preset--font-size--x-large) !important;}
:where(.wp-block-post-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-post-template.is-layout-grid){gap: 1.25em;}
:where(.wp-block-term-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-term-template.is-layout-grid){gap: 1.25em;}
:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}
:root :where(.wp-block-pullquote){font-size: 1.5em;line-height: 1.6;}
/*# sourceURL=global-styles-inline-css */
</style>
<link rel='stylesheet' id='contact-form-7-css' href='https://biogenixpeptides.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=6.1.5' type='text/css' media='all' />
<link rel='stylesheet' id='sr7css-css' href='//biogenixpeptides.com/wp-content/plugins/revslider/public/css/sr7.css?ver=6.7.28' type='text/css' media='all' />
<link rel='stylesheet' id='cartbounty-pro-css' href='https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro/public/css/cartbounty-pro-public.css?ver=11.0.1' type='text/css' media='all' />
<style id='woocommerce-inline-inline-css' type='text/css'>
.woocommerce form .form-row .required { visibility: visible; }
/*# sourceURL=woocommerce-inline-inline-css */
</style>
<link rel='stylesheet' id='cmplz-general-css' href='https://biogenixpeptides.com/wp-content/plugins/complianz-gdpr/assets/css/cookieblocker.min.css?ver=1776680216' type='text/css' media='all' />
<link rel='stylesheet' id='klb-single-ajax-css' href='https://biogenixpeptides.com/wp-content/plugins/medibazar-core/woocommerce-filter/single-ajax/css/single-ajax.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='klb-buy-now-css' href='https://biogenixpeptides.com/wp-content/plugins/medibazar-core/woocommerce-filter/buy-now/css/buy-now.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='klb-sticky-single-cart-css' href='https://biogenixpeptides.com/wp-content/plugins/medibazar-core/woocommerce-filter/sticky-single-cart/css/sticky-single-cart.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='owl-carousel-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//owl.carousel.min.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='animate-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//animate.min.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='magnific-popup-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//magnific-popup.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='fontawesome-all-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//fontawesome-all.min.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='themify-icons-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//themify-icons.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='meanmenu-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//meanmenu.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='slick-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//slick.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='medibazar-main-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//main.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='medibazar-responsive-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/assets/css//responsive.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='medibazar-font-roboto-css' href='//fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&#038;subset=latin,latin-ext' type='text/css' media='all' />
<link rel='stylesheet' id='medibazar-font-poppins-css' href='//fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&#038;subset=latin,latin-ext' type='text/css' media='all' />
<link rel='stylesheet' id='medibazar-style-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar-child/style.css?ver=6.9.4' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-frontend-css' href='https://biogenixpeptides.com/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=4.0.7' type='text/css' media='all' />
<link rel='stylesheet' id='widget-image-css' href='https://biogenixpeptides.com/wp-content/plugins/elementor/assets/css/widget-image.min.css?ver=4.0.7' type='text/css' media='all' />
<link rel='stylesheet' id='widget-heading-css' href='https://biogenixpeptides.com/wp-content/plugins/elementor/assets/css/widget-heading.min.css?ver=4.0.7' type='text/css' media='all' />
<link rel='stylesheet' id='e-animation-slideInRight-css' href='https://biogenixpeptides.com/wp-content/plugins/elementor/assets/lib/animations/styles/slideInRight.min.css?ver=4.0.7' type='text/css' media='all' />
<link rel='stylesheet' id='e-popup-css' href='https://biogenixpeptides.com/wp-content/plugins/elementor-pro/assets/css/conditionals/popup.min.css?ver=4.0.4' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-9-css' href='https://biogenixpeptides.com/wp-content/uploads/elementor/css/post-9.css?ver=1778160644' type='text/css' media='all' />
<link rel='stylesheet' id='sbistyles-css' href='https://biogenixpeptides.com/wp-content/plugins/instagram-feed/css/sbi-styles.min.css?ver=6.10.1' type='text/css' media='all' />
<link rel='stylesheet' id='widget-image-box-css' href='https://biogenixpeptides.com/wp-content/plugins/elementor/assets/css/widget-image-box.min.css?ver=4.0.7' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-21-css' href='https://biogenixpeptides.com/wp-content/uploads/elementor/css/post-21.css?ver=1778160872' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-2679-css' href='https://biogenixpeptides.com/wp-content/uploads/elementor/css/post-2679.css?ver=1778160644' type='text/css' media='all' />
<link rel='stylesheet' id='parent-style-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar/style.css?ver=6.9.4' type='text/css' media='all' />
<link rel='stylesheet' id='medibazar-child-custom-css' href='https://biogenixpeptides.com/wp-content/themes/medibazar-child/css/custom.css?ver=1.1.0' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-gf-roboto-css' href='https://fonts.googleapis.com/css?family=Roboto:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&#038;display=swap' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-gf-robotoslab-css' href='https://fonts.googleapis.com/css?family=Roboto+Slab:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&#038;display=swap' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-gf-anton-css' href='https://fonts.googleapis.com/css?family=Anton:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&#038;display=swap' type='text/css' media='all' />
<script type="text/javascript" src="//biogenixpeptides.com/wp-content/plugins/revslider/public/js/libs/tptools.js?ver=6.7.28" id="tp-tools-js" async="async" data-wp-strategy="async"></script>
<script type="text/javascript" src="//biogenixpeptides.com/wp-content/plugins/revslider/public/js/sr7.js?ver=6.7.28" id="sr7-js" async="async" data-wp-strategy="async"></script>
<script type="text/javascript" id="tp-js-js-extra">
/* <![CDATA[ */
var trustpilot_settings = {"key":"Gfg7KzDoNiXZkmdo","TrustpilotScriptUrl":"https://invitejs.trustpilot.com/tp.min.js","IntegrationAppUrl":"//ecommscript-integrationapp.trustpilot.com","PreviewScriptUrl":"//ecommplugins-scripts.trustpilot.com/v2.1/js/preview.min.js","PreviewCssUrl":"//ecommplugins-scripts.trustpilot.com/v2.1/css/preview.min.css","PreviewWPCssUrl":"//ecommplugins-scripts.trustpilot.com/v2.1/css/preview_wp.css","WidgetScriptUrl":"//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"};
//# sourceURL=tp-js-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/trustpilot-reviews/review/assets/js/headerScript.min.js?ver=1.0&#039; async=&#039;async" id="tp-js-js"></script>
<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js?ver=1.0&#039; async=&#039;async" id="widget-bootstrap-js"></script>
<script type="text/javascript" id="trustbox-js-extra">
/* <![CDATA[ */
var trustbox_settings = {"page":"landing","sku":null,"name":null};
var trustpilot_trustbox_settings = {"trustboxes":[{"enabled":"enabled","snippet":"PGRpdiBjbGFzcz0idHJ1c3RwaWxvdC13aWRnZXQiIGRhdGEtbG9jYWxlPSJlbi1VUyIgZGF0YS10ZW1wbGF0ZS1pZD0iNTNhYTg4MDdkZWM3ZTEwZDM4ZjU5ZjMyIiBkYXRhLWJ1c2luZXNzdW5pdC1pZD0iNjkwNzQ0ZDZjN2FhZTQ1MmNjYmI0MTVjIiBkYXRhLXN0eWxlLWhlaWdodD0iMTEwIiBkYXRhLXN0eWxlLXdpZHRoPSIxMDAlIiBkYXRhLXRoZW1lPSJsaWdodCI+CiAgPGEgaHJlZj0iaHR0cHM6Ly93d3cudHJ1c3RwaWxvdC5jb20vcmV2aWV3L2Jpb2dlbml4cGVwdGlkZXMuY29tIiB0YXJnZXQ9Il9ibGFuayIgcmVsPSJub29wZW5lciI+VHJ1c3RwaWxvdDwvYT4KPC9kaXY+","customizations":"eyJ3aWR0aCI6eyJhdHRyaWJ1dGVOYW1lIjoiZGF0YS1zdHlsZS13aWR0aCJ9LCJoZWlnaHQiOnsiYXR0cmlidXRlTmFtZSI6ImRhdGEtc3R5bGUtaGVpZ2h0In0sInN0YXJzIjpmYWxzZSwidGhlbWUiOnsiYXR0cmlidXRlTmFtZSI6ImRhdGEtdGhlbWUiLCJvcHRpb25zIjpbImxpZ2h0IiwiZGFyayJdfSwibG9jYWxlcyI6eyJhdHRyaWJ1dGVOYW1lIjoiZGF0YS1sb2NhbGUiLCJvcHRpb25zIjpbImRhLURLIiwiZGUtQVQiLCJkZS1DSCIsImRlLURFIiwiZW4tQVUiLCJlbi1DQSIsImVuLUdCIiwiZW4tSUUiLCJlbi1OWiIsImVuLVVTIiwiZXMtRVMiLCJmaS1GSSIsImZyLUJFIiwiZnItRlIiLCJpdC1JVCIsImphLUpQIiwibmItTk8iLCJubC1CRSIsIm5sLU5MIiwicGwtUEwiLCJwdC1CUiIsInB0LVBUIiwicnUtUlUiLCJzdi1TRSIsInpoLUNOIl19LCJ0YWdzIjpmYWxzZSwicHJvZHVjdE5hbWUiOmZhbHNlLCJza3UiOmZhbHNlLCJyaWNoU25pcHBldHMiOmZhbHNlLCJyZXZpZXdMYW5ndWFnZXMiOmZhbHNlLCJ0ZXh0Q29sb3IiOmZhbHNlLCJmb250RmFtaWx5IjpmYWxzZSwic3RhckNvbG9yIjpmYWxzZSwiYm9yZGVyQ29sb3IiOmZhbHNlLCJsaW5rQ29sb3IiOmZhbHNlLCJxdW90ZUNvbG9yIjpmYWxzZSwiYnV0dG9uQ29sb3IiOmZhbHNlLCJub1Jldmlld3MiOmZhbHNlLCJzY3JvbGxUb0xpc3QiOmZhbHNlLCJhbGxvd1JvYm90cyI6ZmFsc2UsIm1pblJldmlld0NvdW50IjpmYWxzZSwiaW1wb3J0ZWRSZXZpZXdzIjpmYWxzZSwid2l0aG91dFJldmlld3NQcmVmZXJyZWRTdHJpbmdJZCI6ZmFsc2UsImFsaWdubWVudCI6ZmFsc2UsImZ1bGxXaWR0aCI6ZmFsc2UsInJldmlld0Rpc2NsYWltZXIiOnsiYXR0cmlidXRlTmFtZSI6ImRhdGEtcmV2aWV3LWRpc2NsYWltZXIiLCJvcHRpb25zIjpbInRydWUiLCJmYWxzZSJdfSwic2l6ZSI6ZmFsc2UsImhlYWRsaW5lIjpmYWxzZSwic3VwcG9ydFRleHQiOmZhbHNlLCJib3JkZXJUeXBlIjpmYWxzZSwiYmFja2dyb3VuZCI6ZmFsc2UsImJyYW5kQ29sb3IiOmZhbHNlLCJ1c2VDYXRlZ29yeUljb24iOmZhbHNlLCJ1c2VDYXRlZ29yeU5hbWUiOmZhbHNlLCJ1c2VSZXZpZXdTbmlwcGV0cyI6ZmFsc2UsImV4dGVybmFsRWxlbWVudHNDb2xvciI6ZmFsc2UsInJldmlld1NuaXBwZXRzTGltaXQiOmZhbHNlLCJyZXZpZXdTbmlwcGV0c1F1b3RlcyI6ZmFsc2UsInJldmlld1NuaXBwZXRzU2VhcmNoIjpmYWxzZSwicmV2aWV3U25pcHBldHNUb3BpYyI6ZmFsc2V9","defaults":"eyJ3aWR0aCI6IjEwMCUiLCJoZWlnaHQiOiIxNTBweCIsInRleHRDb2xvciI6eyJsaWdodCI6IiMxOTE5MTkiLCJkYXJrIjoiI2ZmZmZmZiJ9LCJmb250RmFtaWx5IjoiXCJTZWdvZSBVSVwiLFwiSGVsdmV0aWNhIE5ldWVcIixcIkhlbHZldGljYVwiLFwiQXJpYWxcIixcInNhbnMtc2VyaWZcIiJ9","page":"landing","position":"before","corner":"top: #{Y}px; left: #{X}px;","paddingx":"0","paddingy":"0","zindex":"1000","clear":"both","xpaths":"WyIvL0JPRFkvTUFJTlsxXS9ESVZbMV0vRElWWzFdL0RJVlsxXSIsIi8vRElWW0BjbGFzcz1cImUtY29uLWlubmVyXCJdIiwiL0hUTUxbMV0vQk9EWVsxXS9NQUlOWzFdL0RJVlsxXS9ESVZbMV0vRElWWzFdIl0=","sku":"TRUSTPILOT_SKU_VALUE_3548,SK10","name":"Selank 10mg","widgetName":"Mini","repeatable":false,"uuid":"af48741a-868d-6bf1-0f89-dad10577886a","error":null,"repeatXpath":{"xpathById":{"prefix":"","suffix":""},"xpathFromRoot":{"prefix":"","suffix":""}},"width":"100%","height":"110","locale":"en-US"}]};
//# sourceURL=trustbox-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/trustpilot-reviews/review/assets/js/trustBoxScript.min.js?ver=1.0&#039; async=&#039;async" id="trustbox-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>
<script type="text/javascript" id="cartbounty-pro-exit-intent-js-extra">
/* <![CDATA[ */
var cartbounty_ei = {"hours":"1","product_count":"0","mobile_exit_intent_enabled":""};
//# sourceURL=cartbounty-pro-exit-intent-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro/public/js/cartbounty-pro-public-exit-intent.js?ver=11.0.1" id="cartbounty-pro-exit-intent-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro/public/js/tooltipster.bundle.min.js?ver=11.0.1" id="cartbounty-pro-tooltipster-js"></script>
<script type="text/javascript" id="cartbounty-pro-early-capture-js-extra">
/* <![CDATA[ */
var cartbounty_ec = {"hours":"1","mandatory_input":"","style":"1"};
//# sourceURL=cartbounty-pro-early-capture-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro/public/js/cartbounty-pro-public-early-capture.js?ver=11.0.1" id="cartbounty-pro-early-capture-js"></script>
<script type="text/javascript" id="cartbounty-pro-js-extra">
/* <![CDATA[ */
var cartbounty_co = {"save_custom_fields":"1","checkout_fields":"#email, #billing_email, #billing-country, #billing_country, #billing-first_name, #billing_first_name, #billing-last_name, #billing_last_name, #billing-company, #billing_company, #billing-address_1, #billing_address_1, #billing-address_2, #billing_address_2, #billing-city, #billing_city, #billing-state, #billing_state, #billing-postcode, #billing_postcode, #billing-phone, #billing_phone, #shipping-country, #shipping_country, #shipping-first_name, #shipping_first_name, #shipping-last_name, #shipping_last_name, #shipping-company, #shipping_company, #shipping-address_1, #shipping_address_1, #shipping-address_2, #shipping_address_2, #shipping-city, #shipping_city, #shipping-state, #shipping_state, #shipping-postcode, #shipping_postcode, #shipping-phone, #checkbox-control-1, #ship-to-different-address-checkbox, #checkbox-control-0, #createaccount, #checkbox-control-2, #order-notes textarea, #order_comments","custom_email_selectors":".cartbounty-pro-custom-email-field, .login #username, .wpforms-container input[type=\"email\"], .sgpb-form input[type=\"email\"], .pum-container input[type=\"email\"], .nf-form-cont input[type=\"email\"], .wpcf7 input[type=\"email\"], .fluentform input[type=\"email\"], .sib_signup_form input[type=\"email\"], .mailpoet_form input[type=\"email\"], .tnp input[type=\"email\"], .om-element input[type=\"email\"], .om-holder input[type=\"email\"], .poptin-popup input[type=\"email\"], .gform_wrapper input[type=\"email\"], .paoc-popup input[type=\"email\"], .ays-pb-form input[type=\"email\"], .hustle-form input[type=\"email\"], .et_pb_section input[type=\"email\"], .brave_form_form input[type=\"email\"], .ppsPopupShell input[type=\"email\"], .xoo-el-container input[type=\"email\"], .xoo-el-container input[name=\"xoo-el-username\"]","custom_phone_selectors":".cartbounty-pro-custom-phone-field, .wpforms-container input[type=\"tel\"], .sgpb-form input[type=\"tel\"], .nf-form-cont input[type=\"tel\"], .wpcf7 input[type=\"tel\"], .fluentform input[type=\"tel\"], .om-element input[type=\"tel\"], .om-holder input[type=\"tel\"], .poptin-popup input[type=\"tel\"], .gform_wrapper input[type=\"tel\"], .paoc-popup input[type=\"tel\"], .ays-pb-form input[type=\"tel\"], .hustle-form input[name=\"phone\"], .et_pb_section input[type=\"tel\"], .xoo-el-container input[type=\"tel\"]","custom_button_selectors":".cartbounty-pro-add-to-cart, .add_to_cart_button, .ajax_add_to_cart, .single_add_to_cart_button, .yith-wfbt-submit-button","consent_field":"","email_validation":"^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$","phone_validation":"^[+0-9\\s]\\s?\\d[0-9\\s-.]{6,30}$","is_user_logged_in":"","recaptcha_enabled":"","recaptcha_site_key":"","language":"en_US","nonce":"c09f7b191c","ajaxurl":"https://biogenixpeptides.com/wp-admin/admin-ajax.php"};
//# sourceURL=cartbounty-pro-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro/public/js/cartbounty-pro-public.js?ver=11.0.1" id="cartbounty-pro-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/js/jquery-blockui/jquery.blockUI.min.js?ver=2.7.0-wc.10.7.0" id="wc-jquery-blockui-js" defer="defer" data-wp-strategy="defer"></script>
<script type="text/javascript" id="wc-add-to-cart-js-extra">
/* <![CDATA[ */
var wc_add_to_cart_params = {"ajax_url":"/wp-admin/admin-ajax.php","wc_ajax_url":"/?wc-ajax=%%endpoint%%","i18n_view_cart":"View cart","cart_url":"https://biogenixpeptides.com/cart/","is_cart":"","cart_redirect_after_add":"no"};
//# sourceURL=wc-add-to-cart-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js?ver=10.7.0" id="wc-add-to-cart-js" defer="defer" data-wp-strategy="defer"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/js/js-cookie/js.cookie.min.js?ver=2.1.4-wc.10.7.0" id="wc-js-cookie-js" defer="defer" data-wp-strategy="defer"></script>
<script type="text/javascript" id="woocommerce-js-extra">
/* <![CDATA[ */
var woocommerce_params = {"ajax_url":"/wp-admin/admin-ajax.php","wc_ajax_url":"/?wc-ajax=%%endpoint%%","i18n_password_show":"Show password","i18n_password_hide":"Hide password"};
//# sourceURL=woocommerce-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=10.7.0" id="woocommerce-js" defer="defer" data-wp-strategy="defer"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/medibazar-core/woocommerce-filter/single-ajax/js/single-ajax.js?ver=1.0" id="klb-single-ajax-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/medibazar-core/woocommerce-filter/sticky-single-cart/js/sticky-single-cart.js?ver=1.0" id="klb-sticky-single-cart-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/includes/pjax/js/helpers.js?ver=1.0" id="pjax-helpers-js"></script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZVSNEKLHYT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-ZVSNEKLHYT');
</script>			<style>.cmplz-hidden {
					display: none !important;
				}</style><meta name="og:url" content="https://biogenixpeptides.com/" />
<style type="text/css">

@media(max-width:64rem){
	.single .section .product-type-simple form.cart {
	    position: fixed;
	    bottom: 0;
	    right: 0;
	    z-index: 9999;
	    background: #fff;
	    margin-bottom: 0;
	    padding: 15px;
	    -webkit-box-shadow: 0 -2px 5px rgb(0 0 0 / 7%);
	    box-shadow: 0 -2px 5px rgb(0 0 0 / 7%);
	    justify-content: space-between;
		width: 100%;
		display: flex;
		
	}

	.single .woocommerce-variation-add-to-cart {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    position: fixed;
	    bottom: 0;
	    right: 0;
	    z-index: 9999;
	    background: #fff;
	    margin-bottom: 0;
	    padding: 15px;
	    -webkit-box-shadow: 0 -2px 5px rgb(0 0 0 / 7%);
	    box-shadow: 0 -2px 5px rgb(0 0 0 / 7%);
	    justify-content: space-between;
    	width: 100%;
	}
	
	.single .section .product-type-simple form.cart button.single_add_to_cart_button ,
	.single .section form.cart .woocommerce-variation-add-to-cart button.single_add_to_cart_button {
		padding-right:15px;
		padding-left:15px;
		margin-top:0px;
	}
}


.klb-shop-breadcrumb{
	background-image: url(https://biogenixpeptides.com/wp-content/uploads/2025/11/Shop-Now-About-us-etc.jpg);
}

.klb-blog-breadcrumb{
	background-image: url(https://biogenixpeptides.com/wp-content/uploads/2025/11/Research-Library-Blog.jpg);
}

.theme-bg {
  background: #0a1c7a;
}

.theme-color {
  color: #0a1c7a;
}

#scrollUp {
  background: #0a1c7a;
}

.header-top-info span a {
  color: #0a1c7a;
}

.header-link span a {
  background: #0a1c7a;
}

.shop-menu ul li a:hover {
  color: #0a1c7a;
}

.menu-bar a:hover {
  color: #0a1c7a;
}

.header-search-form button:hover {
  color: #0a1c7a;
}

.header-lang-list {
  border-top: 3px solid #0a1c7a;
}

.header-lang-list li a:hover {
  color: #0a1c7a;
}

.header-icon a:hover {
  color: #0a1c7a;
}

.menu-02 .shop-menu ul li a:hover {
  color: #0a1c7a;
}

.menu-bar-2 a {
  color: #0a1c7a;
}

.header-02-search .header-search-form button {
  background: #0a1c7a;
}

.menu-03 .header-search-form button:hover {
  color: #0a1c7a;
}

.cart-icon a:hover {
  color: #0a1c7a;
}

.close-icon > button {
  color: #0a1c7a;
}

.social-icon-right > a:hover {
  color: #0a1c7a;
}

.side-menu ul li:hover a {
  color: #0a1c7a;
}

.main-menu ul li.active > a {
  color: #0a1c7a;
}
.main-menu ul li:hover > a {
  color: #0a1c7a;
}

.menu-02 .main-menu nav > ul > li:hover > a, .menu-02 .main-menu nav > ul > li.active > a {
  color: #0a1c7a;
}

.menu-03 .main-menu nav > ul > li:hover > a, .menu-03 .main-menu nav > ul > li.active > a {
  color: #0a1c7a;
}

.main-menu ul li .sub-menu {
  border-top: 3px solid #0a1c7a;
}

.main-menu ul li .sub-menu li a:hover {
  color: #0a1c7a;
}

.category-menu {
  border-top: 3px solid #0a1c7a;
}

.category-menu ul li a::before {
  background: #0a1c7a;
}

.category-menu ul li a:hover {
  color: #0a1c7a;
}

.category-menu ul li a i {
  color: #0a1c7a;
}

.section-title h2 > span {
  color: #0a1c7a;
}

.slider-active button.slick-arrow {
  border: 4px solid #0a1c7a;
}

.slider-active button:hover {
  background: #0a1c7a;
}

.c-btn {
  background: #0a1c7a;
}

.red-btn:hover {
  background: #0a1c7a;
}

.b-button > a::after {
  background: #0a1c7a;
}
.b-button > a:hover {
  color: #0a1c7a;
}

.red-b-button > a::after {
  background: #0a1c7a;
}

.gray-b-button > a::after {
  background: #0a1c7a;
}

.banners-active .slick-dots li.slick-active button {
  border-color: #0a1c7a;
  background: #0a1c7a;
}

.product-tab ul li a::before {
  background: #0a1c7a;
}

.product-tab ul li a:hover {
  color: #0a1c7a;
  border-color: #0a1c7a;
}

.product-tab ul li a.active {
  color: #0a1c7a;
  border-color: #0a1c7a;
}

.action-btn {
  background: #0a1c7a;
}

.product-action a.c-btn:hover {
  background: #0a1c7a;
}

.product-text h4 a:hover {
  color: #0a1c7a;
}

.hot-3 {
  background: #0a1c7a;
}

.cat-title::before {
  background: #0a1c7a;
}

.category-item ul li a:hover {
  color: #0a1c7a;
}

.category-item ul li:hover::before {
  color: #0a1c7a;
}

.pro-tab ul li a:hover {
  background: #0a1c7a;
  border-color: #0a1c7a;
}
.pro-tab ul li a.active {
  background: #0a1c7a;
  border-color: #0a1c7a;
}

.product-02-tab ul li a:hover {
  color: #0a1c7a;
}

.product-02-tab li a.active {
  color: #0a1c7a;
}

.c-2 {
  background: #0a1c7a;
}

.p--4 {
  background: #0a1c7a;
}

.stock {
  color: #0a1c7a;
}

.pro-details-icon > a:hover {
  background: #0a1c7a;
  border-color: #0a1c7a;
}

.pro-02-list-icon a:hover {
  border-color: #0a1c7a;
  background: #0a1c7a;
}

.bakix-details-tab ul li a.active {
  color: #0a1c7a;
}

.bakix-details-tab ul li a.active:before {
  background: #0a1c7a;
}

.forgot-login a:hover {
  color: #0a1c7a;
}

.deal-02-wrapper .deal-count .time-count:nth-child(3)::after {
  background: #0a1c7a;
}

.deal-content h2 {
  color: #0a1c7a;
}

.testimonial-wrapper:hover {
  border: 3px solid #0a1c7a;
}

.test-text {
  position: relative;
}
.test-text::before {
  background: #0a1c7a;
}
.test-active button.slick-arrow:hover {
  background: #0a1c7a;
  border-color: #0a1c7a;
}

.client-text::before {
  background: #0a1c7a;
}

.test-02-active button.slick-arrow:hover {
  background: #0a1c7a;
}

.test-03-active button.slick-arrow:hover {
  background: #0a1c7a;
  border-color: #0a1c7a;
}

.blog-wrapper:hover .blog-img::before {
  background: #0a1c7a;
}

.blog-text h4 > a:hover {
  color: #0a1c7a;
}
.color-2 {
  background: #0a1c7a;
}
.blog-meta span > a:hover {
  color: #0a1c7a;
}
.search-form button:hover {
  color: #0a1c7a;
}
.widget-title::after {
  background: #0a1c7a;
}
.blog-side-list li a:hover {
  color: #0a1c7a;
}
.widget-posts-title a:hover {
  color: #0a1c7a;
}
ul.cat li a:hover {
  color: #0a1c7a;
}
.basic-pagination ul li.active a {
  background: #0a1c7a;
}
.basic-pagination ul li:hover a {
  background: #0a1c7a;
}
.post-text blockquote {
  border-left: 5px solid #0a1c7a;
}
.blog-post-tag a:hover {
  background: #0a1c7a;
  border-color: #0a1c7a;
}
.blog-share-icon a:hover {
  color: #0a1c7a;
}
.b-author {
  border-left: 5px solid #0a1c7a;
}
.author-icon a:hover {
  color: #0a1c7a;
}
.avatar-name span {
  color: #0a1c7a;
}
.reply:hover {
  color: #0a1c7a;
}
.bakix-navigation span a:hover {
  color: #0a1c7a;
}
.bakix-navigation h4 a:hover {
  color: #0a1c7a;
}
.fe-1 {
  color: #0a1c7a;
}
.p-feature-text > a:hover {
  color: #0a1c7a;
}
.feature-02-wrapper::before {
  background: #0a1c7a;
}
.feature-02-wrapper::after {
  background: #0a1c7a;
}
.instagram-icon i:hover {
  color: #0a1c7a;
}
.footer-icon a:hover {
  border: #0a1c7a;
  background: #0a1c7a;
}
.footer-link ul li a:hover {
  color: #0a1c7a;
}
.footer-bottom-link ul li a:hover {
  color: #0a1c7a;
}
.breadcrumb-wrapper::before {
  background: #0a1c7a;
}
.about-tag {
  background: #0a1c7a;
}

.about-text h4 i {
  color: #0a1c7a;
}
.team-icon a:hover {
  background: #0a1c7a;
}
.team-text span {
  color: #0a1c7a;
}
.contact-address-icon i {
  color: #0a1c7a;
}

.contacts-form input:focus {
  border-color: #0a1c7a;
}

.contacts-form textarea:focus {
  border-color: #0a1c7a;
}

button.button,
a.checkout-button,
p.woocommerce-mini-cart__buttons.buttons a {
    background: #0a1c7a;
}

button.single_add_to_cart_button:hover {
    background: #0a1c7a;
}
.klb-product a.tinvwl_add_to_wishlist_button {
    background: #0a1c7a;
}
.klb-product a.added_to_cart {
    background: #0a1c7a;
}
.bakix-details-tab ul li.active a:before {
    background: #0a1c7a;
}
.blog-area .col-xl-4:nth-child(even) span.blog-tag.color-1 {
    background: #0a1c7a;
}
ul.page-numbers span.current {
    background: #0a1c7a;
}
ul.page-numbers li:hover a {
    background: #0a1c7a;
}
.widget_price_filter button.button {
    background: #0a1c7a;
}
input[type="submit"] {
    background: #0a1c7a;
}
.breadcrumb-menu li span {
    color: #0a1c7a;
}
.top-cart-row .dropdown-cart .lnk-cart {
	background: #0a1c7a;
}
nav.woocommerce-MyAccount-navigation ul li a {
    background-color: #0a1c7a;
    border: 1px solid #0a1c7a;
}
input.wpcf7-form-control.wpcf7-submit {
    background: #0a1c7a;
}
blockquote {
    border-left: 5px solid #0a1c7a;
}
.tagcloud a:hover{
    background: #0a1c7a;
}
a.comment-reply-link:hover {
    color: #0a1c7a;
}
.elementor-accordion-item div.elementor-tab-title {
    background-color: #0a1c7a !important;
}
.klb-pagination span.post-page-numbers.current, 
.klb-pagination a:hover {
    background: #0a1c7a;
}
.wp-block-search button.wp-block-search__button {
    background: #0a1c7a;
}
.return-to-shop a.button.wc-backward {
    background: #0a1c7a;
}
.blog-standard .blog-meta span i {
    color: #0a1c7a;
}
.post.pingback a.comment-edit-link {
    color: #0a1c7a;
}


.invalid-feedback {
  color: #d83227;
}
.btn-danger {
  background-color: #d83227;
  border-color: #d83227;
}
.btn-danger.disabled, .btn-danger:disabled {
  background-color: #d83227;
  border-color: #d83227;
}
.btn-outline-danger {
  color: #d83227;
  border-color: #d83227;
}
.btn-outline-danger:hover {
  background-color: #d83227;
  border-color: #d83227;
}
.btn-outline-danger.disabled, .btn-outline-danger:disabled {
  color: #d83227;
}
.btn-outline-danger:not(:disabled):not(.disabled):active, .btn-outline-danger:not(:disabled):not(.disabled).active, .show > .btn-outline-danger.dropdown-toggle {
  background-color: #d83227;
  border-color: #d83227;
}
.badge-danger {
  background-color: #d83227;
}
.bg-danger {
  background-color: #d83227 !important;
}
.border-danger {
  border-color: #d83227 !important;
}
.text-danger {
  color: #d83227 !important;
}
.header-top-info span i {
  color: #d83227;
}
.header-02-search .header-search-form button:hover {
  color: #d83227;
}
.hero-slider-caption > span {
  background: #d83227;
}
.hero-slider-caption p::before {
  background: #d83227;
}
.slider-caption span {
  color: #d83227;
}
.slider-caption span::before {
  background: #d83227;
}
.slide-price {
  background: #d83227;
}
.c-btn:hover {
  background: #d83227;
}
.red-btn {
  background: #d83227;
}
.red-b-button > a {
  color: #d83227;
}
.red-b-button > a::before {
  background: #d83227;
}
.new-price {
  color: #d83227;
}
.action-btn:hover {
  background: #d83227;
}
.product-action a.c-btn {
  background: #d83227;
}
.product-text span {
  color: #d83227;
}
.hot-1 {
  background: #d83227;
}
.category-sidebar {
  background-image: -moz-linear-gradient(-48deg, rgba(78, 151, 253, 0.12157) 0%, rgba(126, 130, 191, 0.11) 32%, rgba(228, 87, 61, 0.1) 99%, #d83227 100%);
  background-image: -webkit-linear-gradient(-48deg, rgba(78, 151, 253, 0.12157) 0%, rgba(126, 130, 191, 0.11) 32%, rgba(228, 87, 61, 0.1) 99%, #d83227 100%);
  background-image: -ms-linear-gradient(-48deg, rgba(78, 151, 253, 0.12157) 0%, rgba(126, 130, 191, 0.11) 32%, rgba(228, 87, 61, 0.1) 99%, #d83227 100%);
}
.cat-side .b-03-tag {
  background: #d83227;
}
.c-1 {
  background: #d83227;
}
.p--1 {
  background: #d83227;
}
.cart-plus-minus .qtybutton:hover {
  background: #d83227;
}
.basic-login label span {
  color: #d83227;
}
.forgot-login a {
  color: #d83227;
}
.table-content table td.product-name a:hover {
  color: #d83227;
}
.coupon-accordion h3 {
  border-top: 3px solid #d83227;
}
.coupon-info p.form-row-first label span.required, .coupon-info p.form-row-last label span.required {
  color: #d83227;
}
.country-select label span.required, .checkout-form-list label span.required {
  color: #d83227;
}
.your-order-table table tr.order-total td span {
  color: #d83227;
}
.order-button-payment input:hover {
  background: #d83227;
}
.deal-02-wrapper .deal-count .time-count:nth-child(2)::after {
  background: #d83227;
}
.deal-content > span {
  color: #d83227;
}
.test-text span {
  color: #d83227;
}
.test-active .slick-dots li.slick-active button {
  border-color: #d83227;
}
.client-text h4 span {
  color: #d83227;
}
.test-02-active .slick-dots li.slick-active button {
  border-color: #d83227;
}
.test-02-text > span::before {
  background: #d83227;
}
.color-1 {
  background: #d83227;
}
.fe-2 {
  color: #d83227;
}
.feature-02-wrapper:hover::before {
  background: #d83227;
}
.feature-02-wrapper:hover::after {
  background: #d83227;
}
.feature-02-wrapper .p-feature-text a:hover {
  color: #d83227;
}
.copyright p a {
  color: #d83227;
}
.breadcrumb-menu li a {
  color: #d83227;
}
.counter-icon i {
  color: #d83227;
}
.cta-text span {
  background: #d83227;
}
button.button:hover,
a.checkout-button:hover,
p.woocommerce-mini-cart__buttons.buttons a:hover {
    background: #d83227;
}
button.single_add_to_cart_button {
    background: #d83227;
}
.klb-product del {
    color: #d83227;
}
.klb-product a.tinvwl_add_to_wishlist_button:hover {
    background: #d83227;
}
.klb-product a.added_to_cart:hover {
    background: #d83227;
}
.product-details-wrapper p.price {
    color: #d83227;
}
.ajax_quick_view .product_price {
    color: #d83227;
}
.ui-slider .ui-slider-range {
	background: #d83227 !important;
	border: 1px solid #d83227;
}
.widget_price_filter button.button:hover {
    background: #d83227;
}
span.required,
abbr.required {
    color: #d83227;
}
input[type="submit"]:hover {
    background: #d83227;
}
.woocommerce-form-coupon-toggle {
    border-top: 3px solid #d83227;
}
nav.woocommerce-MyAccount-navigation ul li.is-active a, nav.woocommerce-MyAccount-navigation ul li a:hover {
    background-color: #d83227;
    border-color: #d83227;
}
.woocommerce-MyAccount-content a {
    color: #d83227;
}
input.wpcf7-form-control.wpcf7-submit:hover {
	background: #d83227;
}
.widget_single_banner .b-03-tag {
    background: #d83227;
}
.blog-area .widget.widget_single_banner {
    background-image: -moz-linear-gradient(-48deg, rgba(78, 151, 253, 0.12157) 0%, rgba(126, 130, 191, 0.11) 32%, rgba(228, 87, 61, 0.1) 99%, #d83227 100%);
    background-image: -webkit-linear-gradient(-48deg, rgba(78, 151, 253, 0.12157) 0%, rgba(126, 130, 191, 0.11) 32%, rgba(228, 87, 61, 0.1) 99%, #d83227 100%);
    background-image: -ms-linear-gradient(-48deg, rgba(78, 151, 253, 0.12157) 0%, rgba(126, 130, 191, 0.11) 32%, rgba(228, 87, 61, 0.1) 99%, #d83227 100%);
}
.wp-block-search button.wp-block-search__button:hover {
    background: #d83227;
}
div.woocommerce-variation-price span.price {
    color: #d83227;
}
.return-to-shop a.button.wc-backward:hover {
    background: #d83227;
}

.header-top-area {
    background-color: #011c7a;
}

.shop-menu ul li a  {
    color: #ffffff;
}

.shop-menu ul li a:hover {
    color: #e10000;
}

.main-menu-area , header .sticky{
    background-color: ;
}

.main-menu ul li a , .main-menu ul li .sub-menu li a  {
    color: ;
}

.main-menu ul li:hover > a, .main-menu ul li .sub-menu li a:hover , .main-menu ul li.active > a{
    color: ;
}

.footer-area {
    background-color: ;
}

h3.footer-title {
    color: ;
}

h3.footer-title:hover {
    color: ;
}


.footer-area p,
.klbfooterwidget ul li a,
.footer-icon a {
    color: ;
}

.footer-area p:hover,
.klbfooterwidget ul li a:hover,
.footer-icon a:hover {
    color: ;
}

.footer-bottom-area {
    background-color: ;
}

.footer-bottom-link ul li a,
.copyright p {
    color: ;
}

.footer-bottom-link ul li a:hover,
.copyright p:hover {
    color: ;
}

.footer-fix-nav{
	background-color: ;
}

.footer-fix-nav .col{
	border-right-color: ;
}

.footer-fix-nav a i{
	color: ;
}

.footer-fix-nav a i:hover{
	color: ;
}

#preloader{
	background: #fff url('https://biogenixpeptides.com/wp-content/uploads/2026/03/BGX-Website-Logo.png') no-repeat center center; 
}
</style>
	<noscript><style>.woocommerce-product-gallery{ opacity: 1 !important; }</style></noscript>
	<meta name="generator" content="Elementor 4.0.7; features: e_font_icon_svg, additional_custom_breakpoints; settings: css_print_method-external, google_font-enabled, font_display-swap">
<style>
.payment_box.payment_method_ipospays {
    color: red;
}
</style>
<script>
(function($){
  function ensureOverlay(){
    if(document.getElementById('sh-payment-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'sh-payment-overlay';
    overlay.innerHTML = `
      <div class="box" role="status" aria-live="polite" aria-label="Payment processing">
        <div class="spinner"></div>
        <svg class="check" viewBox="0 0 52 52" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="5" d="M14 27 l7 7 l17 -17"/>
          <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="3" opacity="0.25"/>
        </svg>
        <div class="title">Processing payment…</div>
        <p class="sub">Processing payment. This can take up to 10 seconds. Please don’t refresh or click back.</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function showOverlay(){
    ensureOverlay();
    $('#sh-payment-overlay')
      .removeClass('is-success')
      .css('display','flex');
  }

  function successOverlay(){
    $('#sh-payment-overlay')
      .addClass('is-success')
      .find('.title').text('Payment received. Finishing up…').end()
      .find('.sub').text('Payment confirmed. Redirecting you now...');
  }

  function hideOverlay(){
    $('#sh-payment-overlay').hide();
  }

  $(function(){
    // Only on checkout page
    if(!$('form.checkout').length) return;

    ensureOverlay();

    // Show when user submits order
    $(document).on('click', '#place_order', function(){
      // Let Woo validate first. Overlay shows immediately to prevent double-click panic.
      showOverlay();
    });

    // WooCommerce triggers checkout_place_order before ajax. If validation blocks, hide overlay.
    $(document.body).on('checkout_error', function(){
      hideOverlay();
    });

    // When checkout request is sent, Woo adds .processing and blocks UI. Keep overlay visible.
    $(document.body).on('checkout_place_order', function(){
      showOverlay();
      return true;
    });

    // When checkout finishes successfully, Woo redirects quickly.
    // This gives you the "green check" moment if there is a short delay.
    $(document.body).on('checkout_place_order_success', function(){
      successOverlay();
      return true;
    });

    // If Woo updates fragments / reloads checkout, keep overlay in sync
    $(document.body).on('updated_checkout', function(){
      if($('form.checkout').hasClass('processing')){
        showOverlay();
      }
    });
  });
})(jQuery);
</script>
			<style>
				.e-con.e-parent:nth-of-type(n+4):not(.e-lazyloaded):not(.e-no-lazyload),
				.e-con.e-parent:nth-of-type(n+4):not(.e-lazyloaded):not(.e-no-lazyload) * {
					background-image: none !important;
				}
				@media screen and (max-height: 1024px) {
					.e-con.e-parent:nth-of-type(n+3):not(.e-lazyloaded):not(.e-no-lazyload),
					.e-con.e-parent:nth-of-type(n+3):not(.e-lazyloaded):not(.e-no-lazyload) * {
						background-image: none !important;
					}
				}
				@media screen and (max-height: 640px) {
					.e-con.e-parent:nth-of-type(n+2):not(.e-lazyloaded):not(.e-no-lazyload),
					.e-con.e-parent:nth-of-type(n+2):not(.e-lazyloaded):not(.e-no-lazyload) * {
						background-image: none !important;
					}
				}
			</style>
			<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
<meta name="generator" content="Powered by Slider Revolution 6.7.28 - responsive, Mobile-Friendly Slider Plugin for WordPress with comfortable drag and drop interface." />
<link rel="icon" href="https://biogenixpeptides.com/wp-content/uploads/2025/11/cropped-BioGenix_Peptides_Logo_Primary_1-32x32.png" sizes="32x32" />
<link rel="icon" href="https://biogenixpeptides.com/wp-content/uploads/2025/11/cropped-BioGenix_Peptides_Logo_Primary_1-192x192.png" sizes="192x192" />
<link rel="apple-touch-icon" href="https://biogenixpeptides.com/wp-content/uploads/2025/11/cropped-BioGenix_Peptides_Logo_Primary_1-180x180.png" />
<meta name="msapplication-TileImage" content="https://biogenixpeptides.com/wp-content/uploads/2025/11/cropped-BioGenix_Peptides_Logo_Primary_1-270x270.png" />
<script>
	window._tpt			??= {};
	window.SR7			??= {};
	_tpt.R				??= {};
	_tpt.R.fonts		??= {};
	_tpt.R.fonts.customFonts??= {};
	SR7.devMode			=  false;
	SR7.F 				??= {};
	SR7.G				??= {};
	SR7.LIB				??= {};
	SR7.E				??= {};
	SR7.E.gAddons		??= {};
	SR7.E.php 			??= {};
	SR7.E.nonce			= 'e3505cc0e9';
	SR7.E.ajaxurl		= 'https://biogenixpeptides.com/wp-admin/admin-ajax.php';
	SR7.E.resturl		= 'https://biogenixpeptides.com/wp-json/';
	SR7.E.slug_path		= 'revslider/revslider.php';
	SR7.E.slug			= 'revslider';
	SR7.E.plugin_url	= 'https://biogenixpeptides.com/wp-content/plugins/revslider/';
	SR7.E.wp_plugin_url = 'https://biogenixpeptides.com/wp-content/plugins/';
	SR7.E.revision		= '6.7.28';
	SR7.E.fontBaseUrl	= '';
	SR7.G.breakPoints 	= [1240,1024,778,480];
	SR7.E.modules 		= ['module','page','slide','layer','draw','animate','srtools','canvas','defaults','carousel','navigation','media','modifiers','migration'];
	SR7.E.libs 			= ['WEBGL'];
	SR7.E.css 			= ['csslp','cssbtns','cssfilters','cssnav','cssmedia'];
	SR7.E.resources		= {};
	SR7.JSON			??= {};
/*! Slider Revolution 7.0 - Page Processor */
!function(){"use strict";window.SR7??={},window._tpt??={},SR7.version="Slider Revolution 6.7.16",_tpt.getWinDim=function(t){_tpt.screenHeightWithUrlBar??=window.innerHeight;let e=SR7.F?.modal?.visible&&SR7.M[SR7.F.module.getIdByAlias(SR7.F.modal.requested)];_tpt.scrollBar=window.innerWidth!==document.documentElement.clientWidth||e&&window.innerWidth!==e.c.module.clientWidth,_tpt.winW=window.innerWidth-(_tpt.scrollBar||"prepare"==t?_tpt.scrollBarW??_tpt.mesureScrollBar():0),_tpt.winH=window.innerHeight,_tpt.winWAll=document.documentElement.clientWidth},_tpt.getResponsiveLevel=function(t,e){SR7.M[e];return _tpt.closestGE(t,_tpt.winWAll)},_tpt.mesureScrollBar=function(){let t=document.createElement("div");return t.className="RSscrollbar-measure",t.style.width="100px",t.style.height="100px",t.style.overflow="scroll",t.style.position="absolute",t.style.top="-9999px",document.body.appendChild(t),_tpt.scrollBarW=t.offsetWidth-t.clientWidth,document.body.removeChild(t),_tpt.scrollBarW},_tpt.loadCSS=async function(t,e,s){return s?_tpt.R.fonts.required[e].status=1:(_tpt.R[e]??={},_tpt.R[e].status=1),new Promise(((n,i)=>{if(_tpt.isStylesheetLoaded(t))s?_tpt.R.fonts.required[e].status=2:_tpt.R[e].status=2,n();else{const o=document.createElement("link");o.rel="stylesheet";let l="text",r="css";o["type"]=l+"/"+r,o.href=t,o.onload=()=>{s?_tpt.R.fonts.required[e].status=2:_tpt.R[e].status=2,n()},o.onerror=()=>{s?_tpt.R.fonts.required[e].status=3:_tpt.R[e].status=3,i(new Error(`Failed to load CSS: ${t}`))},document.head.appendChild(o)}}))},_tpt.addContainer=function(t){const{tag:e="div",id:s,class:n,datas:i,textContent:o,iHTML:l}=t,r=document.createElement(e);if(s&&""!==s&&(r.id=s),n&&""!==n&&(r.className=n),i)for(const[t,e]of Object.entries(i))"style"==t?r.style.cssText=e:r.setAttribute(`data-${t}`,e);return o&&(r.textContent=o),l&&(r.innerHTML=l),r},_tpt.collector=function(){return{fragment:new DocumentFragment,add(t){var e=_tpt.addContainer(t);return this.fragment.appendChild(e),e},append(t){t.appendChild(this.fragment)}}},_tpt.isStylesheetLoaded=function(t){let e=t.split("?")[0];return Array.from(document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"]')).some((t=>t.href.split("?")[0]===e))},_tpt.preloader={requests:new Map,preloaderTemplates:new Map,show:function(t,e){if(!e||!t)return;const{type:s,color:n}=e;if(s<0||"off"==s)return;const i=`preloader_${s}`;let o=this.preloaderTemplates.get(i);o||(o=this.build(s,n),this.preloaderTemplates.set(i,o)),this.requests.has(t)||this.requests.set(t,{count:0});const l=this.requests.get(t);clearTimeout(l.timer),l.count++,1===l.count&&(l.timer=setTimeout((()=>{l.preloaderClone=o.cloneNode(!0),l.anim&&l.anim.kill(),void 0!==_tpt.gsap?l.anim=_tpt.gsap.fromTo(l.preloaderClone,1,{opacity:0},{opacity:1}):l.preloaderClone.classList.add("sr7-fade-in"),t.appendChild(l.preloaderClone)}),150))},hide:function(t){if(!this.requests.has(t))return;const e=this.requests.get(t);e.count--,e.count<0&&(e.count=0),e.anim&&e.anim.kill(),0===e.count&&(clearTimeout(e.timer),e.preloaderClone&&(e.preloaderClone.classList.remove("sr7-fade-in"),e.anim=_tpt.gsap.to(e.preloaderClone,.3,{opacity:0,onComplete:function(){e.preloaderClone.remove()}})))},state:function(t){if(!this.requests.has(t))return!1;return this.requests.get(t).count>0},build:(t,e="#ffffff",s="")=>{if(t<0||"off"===t)return null;const n=parseInt(t);if(t="prlt"+n,isNaN(n))return null;if(_tpt.loadCSS(SR7.E.plugin_url+"public/css/preloaders/t"+n+".css","preloader_"+t),isNaN(n)||n<6){const i=`background-color:${e}`,o=1===n||2==n?i:"",l=3===n||4==n?i:"",r=_tpt.collector();["dot1","dot2","bounce1","bounce2","bounce3"].forEach((t=>r.add({tag:"div",class:t,datas:{style:l}})));const d=_tpt.addContainer({tag:"sr7-prl",class:`${t} ${s}`,datas:{style:o}});return r.append(d),d}{let i={};if(7===n){let t;e.startsWith("#")?(t=e.replace("#",""),t=`rgba(${parseInt(t.substring(0,2),16)}, ${parseInt(t.substring(2,4),16)}, ${parseInt(t.substring(4,6),16)}, `):e.startsWith("rgb")&&(t=e.slice(e.indexOf("(")+1,e.lastIndexOf(")")).split(",").map((t=>t.trim())),t=`rgba(${t[0]}, ${t[1]}, ${t[2]}, `),t&&(i.style=`border-top-color: ${t}0.65); border-bottom-color: ${t}0.15); border-left-color: ${t}0.65); border-right-color: ${t}0.15)`)}else 12===n&&(i.style=`background:${e}`);const o=[10,0,4,2,5,9,0,4,4,2][n-6],l=_tpt.collector(),r=l.add({tag:"div",class:"sr7-prl-inner",datas:i});Array.from({length:o}).forEach((()=>r.appendChild(l.add({tag:"span",datas:{style:`background:${e}`}}))));const d=_tpt.addContainer({tag:"sr7-prl",class:`${t} ${s}`});return l.append(d),d}}},SR7.preLoader={show:(t,e)=>{"off"!==(SR7.M[t]?.settings?.pLoader?.type??"off")&&_tpt.preloader.show(e||SR7.M[t].c.module,SR7.M[t]?.settings?.pLoader??{color:"#fff",type:10})},hide:(t,e)=>{"off"!==(SR7.M[t]?.settings?.pLoader?.type??"off")&&_tpt.preloader.hide(e||SR7.M[t].c.module)},state:(t,e)=>_tpt.preloader.state(e||SR7.M[t].c.module)},_tpt.prepareModuleHeight=function(t){window.SR7.M??={},window.SR7.M[t.id]??={},"ignore"==t.googleFont&&(SR7.E.ignoreGoogleFont=!0);let e=window.SR7.M[t.id];if(null==_tpt.scrollBarW&&_tpt.mesureScrollBar(),e.c??={},e.states??={},e.settings??={},e.settings.size??={},t.fixed&&(e.settings.fixed=!0),e.c.module=document.getElementById(t.id),e.c.adjuster=e.c.module.getElementsByTagName("sr7-adjuster")[0],e.c.content=e.c.module.getElementsByTagName("sr7-content")[0],"carousel"==t.type&&(e.c.carousel=e.c.content.getElementsByTagName("sr7-carousel")[0]),null==e.c.module||null==e.c.module)return;t.plType&&t.plColor&&(e.settings.pLoader={type:t.plType,color:t.plColor}),void 0===t.plType||"off"===t.plType||SR7.preLoader.state(t.id)&&SR7.preLoader.state(t.id,e.c.module)||SR7.preLoader.show(t.id,e.c.module),_tpt.winW||_tpt.getWinDim("prepare"),_tpt.getWinDim();let s=""+e.c.module.dataset?.modal;"modal"==s||"true"==s||"undefined"!==s&&"false"!==s||(e.settings.size.fullWidth=t.size.fullWidth,e.LEV??=_tpt.getResponsiveLevel(window.SR7.G.breakPoints,t.id),t.vpt=_tpt.fillArray(t.vpt,5),e.settings.vPort=t.vpt[e.LEV],void 0!==t.el&&"720"==t.el[4]&&t.gh[4]!==t.el[4]&&"960"==t.el[3]&&t.gh[3]!==t.el[3]&&"768"==t.el[2]&&t.gh[2]!==t.el[2]&&delete t.el,e.settings.size.height=null==t.el||null==t.el[e.LEV]||0==t.el[e.LEV]||"auto"==t.el[e.LEV]?_tpt.fillArray(t.gh,5,-1):_tpt.fillArray(t.el,5,-1),e.settings.size.width=_tpt.fillArray(t.gw,5,-1),e.settings.size.minHeight=_tpt.fillArray(t.mh??[0],5,-1),e.cacheSize={fullWidth:e.settings.size?.fullWidth,fullHeight:e.settings.size?.fullHeight},void 0!==t.off&&(t.off?.t&&(e.settings.size.m??={})&&(e.settings.size.m.t=t.off.t),t.off?.b&&(e.settings.size.m??={})&&(e.settings.size.m.b=t.off.b),t.off?.l&&(e.settings.size.p??={})&&(e.settings.size.p.l=t.off.l),t.off?.r&&(e.settings.size.p??={})&&(e.settings.size.p.r=t.off.r),e.offsetPrepared=!0),_tpt.updatePMHeight(t.id,t,!0))},_tpt.updatePMHeight=(t,e,s)=>{let n=SR7.M[t];var i=n.settings.size.fullWidth?_tpt.winW:n.c.module.parentNode.offsetWidth;i=0===i||isNaN(i)?_tpt.winW:i;let o=n.settings.size.width[n.LEV]||n.settings.size.width[n.LEV++]||n.settings.size.width[n.LEV--]||i,l=n.settings.size.height[n.LEV]||n.settings.size.height[n.LEV++]||n.settings.size.height[n.LEV--]||0,r=n.settings.size.minHeight[n.LEV]||n.settings.size.minHeight[n.LEV++]||n.settings.size.minHeight[n.LEV--]||0;if(l="auto"==l?0:l,l=parseInt(l),"carousel"!==e.type&&(i-=parseInt(e.onw??0)||0),n.MP=!n.settings.size.fullWidth&&i<o||_tpt.winW<o?Math.min(1,i/o):1,e.size.fullScreen||e.size.fullHeight){let t=parseInt(e.fho)||0,s=(""+e.fho).indexOf("%")>-1;e.newh=_tpt.winH-(s?_tpt.winH*t/100:t)}else e.newh=n.MP*Math.max(l,r);if(e.newh+=(parseInt(e.onh??0)||0)+(parseInt(e.carousel?.pt)||0)+(parseInt(e.carousel?.pb)||0),void 0!==e.slideduration&&(e.newh=Math.max(e.newh,parseInt(e.slideduration)/3)),e.shdw&&_tpt.buildShadow(e.id,e),n.c.adjuster.style.height=e.newh+"px",n.c.module.style.height=e.newh+"px",n.c.content.style.height=e.newh+"px",n.states.heightPrepared=!0,n.dims??={},n.dims.moduleRect=n.c.module.getBoundingClientRect(),n.c.content.style.left="-"+n.dims.moduleRect.left+"px",!n.settings.size.fullWidth)return s&&requestAnimationFrame((()=>{i!==n.c.module.parentNode.offsetWidth&&_tpt.updatePMHeight(e.id,e)})),void _tpt.bgStyle(e.id,e,window.innerWidth==_tpt.winW,!0);_tpt.bgStyle(e.id,e,window.innerWidth==_tpt.winW,!0),requestAnimationFrame((function(){s&&requestAnimationFrame((()=>{i!==n.c.module.parentNode.offsetWidth&&_tpt.updatePMHeight(e.id,e)}))})),n.earlyResizerFunction||(n.earlyResizerFunction=function(){requestAnimationFrame((function(){_tpt.getWinDim(),_tpt.moduleDefaults(e.id,e),_tpt.updateSlideBg(t,!0)}))},window.addEventListener("resize",n.earlyResizerFunction))},_tpt.buildShadow=function(t,e){let s=SR7.M[t];null==s.c.shadow&&(s.c.shadow=document.createElement("sr7-module-shadow"),s.c.shadow.classList.add("sr7-shdw-"+e.shdw),s.c.content.appendChild(s.c.shadow))},_tpt.bgStyle=async(t,e,s,n,i)=>{const o=SR7.M[t];if((e=e??o.settings).fixed&&!o.c.module.classList.contains("sr7-top-fixed")&&(o.c.module.classList.add("sr7-top-fixed"),o.c.module.style.position="fixed",o.c.module.style.width="100%",o.c.module.style.top="0px",o.c.module.style.left="0px",o.c.module.style.pointerEvents="none",o.c.module.style.zIndex=5e3,o.c.content.style.pointerEvents="none"),null==o.c.bgcanvas){let t=document.createElement("sr7-module-bg"),l=!1;if("string"==typeof e?.bg?.color&&e?.bg?.color.includes("{"))if(_tpt.gradient&&_tpt.gsap)e.bg.color=_tpt.gradient.convert(e.bg.color);else try{let t=JSON.parse(e.bg.color);(t?.orig||t?.string)&&(e.bg.color=JSON.parse(e.bg.color))}catch(t){return}let r="string"==typeof e?.bg?.color?e?.bg?.color||"transparent":e?.bg?.color?.string??e?.bg?.color?.orig??e?.bg?.color?.color??"transparent";if(t.style["background"+(String(r).includes("grad")?"":"Color")]=r,("transparent"!==r||i)&&(l=!0),o.offsetPrepared&&(t.style.visibility="hidden"),e?.bg?.image?.src&&(t.style.backgroundImage=`url(${e?.bg?.image.src})`,t.style.backgroundSize=""==(e.bg.image?.size??"")?"cover":e.bg.image.size,t.style.backgroundPosition=e.bg.image.position,t.style.backgroundRepeat=""==e.bg.image.repeat||null==e.bg.image.repeat?"no-repeat":e.bg.image.repeat,l=!0),!l)return;o.c.bgcanvas=t,e.size.fullWidth?t.style.width=_tpt.winW-(s&&_tpt.winH<document.body.offsetHeight?_tpt.scrollBarW:0)+"px":n&&(t.style.width=o.c.module.offsetWidth+"px"),e.sbt?.use?o.c.content.appendChild(o.c.bgcanvas):o.c.module.appendChild(o.c.bgcanvas)}o.c.bgcanvas.style.height=void 0!==e.newh?e.newh+"px":("carousel"==e.type?o.dims.module.h:o.dims.content.h)+"px",o.c.bgcanvas.style.left=!s&&e.sbt?.use||o.c.bgcanvas.closest("SR7-CONTENT")?"0px":"-"+(o?.dims?.moduleRect?.left??0)+"px"},_tpt.updateSlideBg=function(t,e){const s=SR7.M[t];let n=s.settings;s?.c?.bgcanvas&&(n.size.fullWidth?s.c.bgcanvas.style.width=_tpt.winW-(e&&_tpt.winH<document.body.offsetHeight?_tpt.scrollBarW:0)+"px":preparing&&(s.c.bgcanvas.style.width=s.c.module.offsetWidth+"px"))},_tpt.moduleDefaults=(t,e)=>{let s=SR7.M[t];null!=s&&null!=s.c&&null!=s.c.module&&(s.dims??={},s.dims.moduleRect=s.c.module.getBoundingClientRect(),s.c.content.style.left="-"+s.dims.moduleRect.left+"px",s.c.content.style.width=_tpt.winW-_tpt.scrollBarW+"px","carousel"==e.type&&(s.c.module.style.overflow="visible"),_tpt.bgStyle(t,e,window.innerWidth==_tpt.winW))},_tpt.getOffset=t=>{var e=t.getBoundingClientRect(),s=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+n,left:e.left+s}},_tpt.fillArray=function(t,e){let s,n;t=Array.isArray(t)?t:[t];let i=Array(e),o=t.length;for(n=0;n<t.length;n++)i[n+(e-o)]=t[n],null==s&&"#"!==t[n]&&(s=t[n]);for(let t=0;t<e;t++)void 0!==i[t]&&"#"!=i[t]||(i[t]=s),s=i[t];return i},_tpt.closestGE=function(t,e){let s=Number.MAX_VALUE,n=-1;for(let i=0;i<t.length;i++)t[i]-1>=e&&t[i]-1-e<s&&(s=t[i]-1-e,n=i);return++n}}();</script>
		<style type="text/css" id="wp-custom-css">
			
/* Payment processing overlay */
#sh-payment-overlay{
  position: fixed;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,.92),
    rgba(245,246,250,.92)
  );
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}

#sh-payment-overlay .box{
  background: #ffffff;
  border: 1px solid #e2e4ea;
  border-radius: 16px;
  padding: 24px 22px 20px;
  width: min(420px, calc(100% - 40px));
  text-align: center;
  box-shadow: 0 12px 34px rgba(2,32,136,.18);
}

/* Spinner */
#sh-payment-overlay .spinner{
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 4px solid #d9dce8;            /* silver / gray */
  border-top-color: #022088;            /* brand blue */
  margin: 0 auto 14px;
  animation: shspin .9s linear infinite;
}

/* Title + copy */
#sh-payment-overlay .title{
  font-size: 16px;
  font-weight: 600;
  color: #022088;
  margin: 2px 0 6px;
}

#sh-payment-overlay .sub{
  font-size: 13px;
  color: #5c6170;
  margin: 0;
}

/* Success state */
#sh-payment-overlay.is-success .spinner{
  animation: none;
  border: none;
  width: 58px;
  height: 58px;
  margin-bottom: 10px;
}

#sh-payment-overlay .check{
  display: none;
  width: 58px;
  height: 58px;
  margin: 0 auto 10px;
  color: #1a7f37; /* success green */
}

#sh-payment-overlay.is-success .check{
  display: block;
}

#sh-payment-overlay.is-success .title{
  color: #1a7f37;
}

/* Optional subtle accent line */
#sh-payment-overlay .box::after{
  content: "";
  display: block;
  height: 3px;
  width: 60px;
  margin: 14px auto 0;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    #022088,
    #d83227
  );
}

/* Spinner animation */
@keyframes shspin {
  to { transform: rotate(360deg); }
}


p.woocommerce-store-notice.demo_store {z-index:200;background-color:#0a1c7a}

a#scrollUp {display:none!important;}

.woocommerce-checkout #place_order.disable {
    opacity: 1;
    pointer-events: all !important;
}
span.product-tag.out-of-stock {
    background-color: #d83227;
    width: auto;
    padding-left: 10px;
    padding-right: 10px;
    text-transform: none;
    font-size: 11px;
}
.product-tag {
    top: 10px !important;
    left: 30px !important;
}
.klb-product .product-action a del {
    display: none;
}
.mbz-df-item p.product.woocommerce.add_to_cart_inline a.added {
    display: none;
}
.mbz-df-item p.product.woocommerce.add_to_cart_inline a.added_to_cart.wc-forward {
    text-decoration: underline;
    color: #333;
    white-space: nowrap;
}
.mbz-df-item p.product.woocommerce.add_to_cart_inline a {
    width: auto;
    height: auto;
    border-radius: 50px;
    padding: 0px 15px;
    margin-bottom: 5px;
}
.widget_single_banner .c-side-button.mt-20 {
    display: none;
}
/* Hide the cart dropdown panel (common Bootstrap structure: trigger + .dropdown-menu) */
a.lnk-cart + .dropdown-menu,
a.lnk-cart ~ .dropdown-menu {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Hide WooCommerce's injected "View cart" link after adding via AJAX */



iframe#poynt-collect-v2-iframe {
    width: 100% !important;
}
.pro-ful-tab .term-description p {
    display: none;
}
.main-menu nav ul li {
    margin-right: 15px;
}

main-menu ul li a {
    font-size: 20px;
}

.elementor-element.elementor-element-37d4907.e-grid.e-con-full.e-con.e-child {
    transform: scale(1.2);
}

.elementor-position-left.elementor-vertical-align-middle.elementor-widget.elementor-widget-image-box .elementor-image-box-wrapper:hover {
    transform: scale(1.05);
}

.product-03-wrapper.grey-2-bg.pos-rel.text-center.mb-30:hover {
    transform: scale(1.05);
}

ul#menu-menu-1 {
    text-align: center;
}
@media (min-width: 1200px) {
    header .col-xl-3.col-lg-3 {
			max-width: 22%;
			flex: 0 0 22%;
	}
}
@media (min-width: 1200px) {
    header .col-xl-9 {
        max-width: 78%;
        flex: 0 0 78%;
    }
}

.wc-tabs-wrapper #tab-description > h2 {
    display: block;
}
.shop1-sidebar .category-sidebar {
    background-image: none !important;
    background-color: #F3F3F5;
}

/* Home Page hero  */
.elementor-element-24237dd .slider-02-img {
  margin-left: 150px;
}
.elementor-element-24237dd .single-slider.slider-2-height .row {
  align-items: center;
}
.klb-product .product-text {
    margin-top: 54px;
}
.klb-product .product-action {
    bottom: -40px;
}
.product-03-wrapper:hover .product-action {
    bottom: -30px;
}

/* Footer  */
footer .footer-wrapper {
	overflow: unset !important;
	min-width: 250px;
}

footer .phone-footer {
	min-width: 220px;
}


/* Preloader  */
#preloader {
 
	background-size: 220px;
 
}

/*Blog*/
.blog-img a img {
	width: 100% !important;
}

.features-wrapper {
    display: flex;
    align-items: center;
}
.features-icon.fe-1.f-left {
    width: 50%;
}
.cls-1 {
    fill: #021981!important;
    stroke: #6775b4;
    stroke-miterlimit: 2.61;
    stroke-width: .5px;
	  clip-path:none!important;
}

.features-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
	  height:100%!important;
}
.features-icon.fe-1.f-left {
    width: 30%;
    margin-bottom: 20px;
}
.features-icon{
	margin-right:0;
}

.elementor-element-afe9e4f{
	height:100%;
}
.elementor-element-afe9e4f>.elementor-widget-container {
    height: 100%!important;
}
.elementor-element-07faad6{
	height:100%;
}
.elementor-element-07faad6>.elementor-widget-container{
	height:100%!important;
}
.elementor-element-cd0cdfc{
	height:100%;
}
.elementor-element-cd0cdfc>.elementor-widget-container {
    height: 100%!important;
}
.elementor-element-aca42ad>.elementor-widget-container {
    height: 100%!important;
}
.elementor-element-aca42ad{
	height:100%;
}
.footer-area .row > .col-xl-2:last-child {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
}
.footer-area .row > .col-xl-2:last-child .widget_text p {
	font-size:13px;
	text-align: center;
	line-height: 1.5;
}
@media (max-width:767px) {
	/* General tab styling */
.woocommerce-tabs .wc-tabs {
    display: flex;
    gap: 10px;
    border-bottom: 1px solid #ddd;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 8px;
}

/* Hide ugly scrollbar on mobile */
.woocommerce-tabs .wc-tabs::-webkit-scrollbar {
    display: none;
}

.woocommerce-tabs .wc-tabs li {
    flex: 0 0 auto; 
}

.woocommerce-tabs .wc-tabs li a {
    display: inline-block;
    padding: 10px 14px !important;
    font-size: 15px;
    border-radius: 6px;
    background: #f7f7f7;
    color: #444;
    text-decoration: none;
}

.woocommerce-tabs .wc-tabs li.active a,
.woocommerce-tabs .wc-tabs li a:hover {
    background: #222;
    color: #fff;
}

}

/* Shiping css  */
#shipping_method li {
	display: flex;
	gap: 10px;
}
.cart-collaterals {
    display: flex;
    gap: 50px;
}
.cart-collaterals .cross-sells {
    width: 50%;
}
.cross-sells .klb-product.col-xl-4 {
    width: 50%;
}
/*Product card css*/

/* .product-text h4 a:after {
  content: "Learn More";
  display: block;
  padding: 10px;
  border: 1px solid #666;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 5px;
} */
.klb-product .product-action {
  opacity: 1;
  bottom: 20px;
}
.product-02-img.pos-rel {
  position: unset;
}
.klb-product .product-action .action-btn.button.detail-bnt {
  display: none;
}
.klb-product .product-action .action-btn.add_to_cart_button i {
  display: none;
}
.klb-product .product-action a {
	background: #0087C6;
	width: 90%;
	border-radius: 5px;
	height: auto;
	line-height: 1.4;
	padding: 12px 15px;
	white-space: wrap;
}

.klb-product .product-action a.added {
	display: none;
}

.product-03-wrapper:hover .product-action {
  bottom: 20px;
}

.klb-product a.added_to_cart:hover {
	background: #0087C6;
}
.klb-product .product-text .woocommerce-Price-amount.amount {
	display: none;
}

.klb-product .product-03-wrapper {
  padding: 0;
  padding-bottom: 94px;
  background: #fff;
	position: unset;
}
.klb-product.col-xl-3 {
    margin-bottom: 20px;
}
.klb-product .product-text {
  margin-top: 25px;
}

.klb-product .product-action a.action-btn.button.learn-more-btn {
	background: #fff;
	color: #000;
	border: 1px solid #666;
	margin-bottom: 10px;
}

.product-03-wrapper.grey-2-bg.pos-rel.text-center.mb-30:hover {
	transform: none;
}

@media only screen and (max-width:440px) {
.klb-product .product-03-wrapper {

	padding-bottom: 90px;
	
}
	.klb-product .product-action a {
    font-size: 13px;
		padding:10px;
}

}


.b-02-tag.b-03-tag {display:none!important;}
table.table.shop_table.shop_table_responsive.cart .product-thumbnail img {
    height: auto;
    min-width: 70px;
}
/* MOBILE RESPONSIVE CART TABLE */
@media (max-width: 767px) {
.cart-collaterals .cross-sells {
    width: 100%;
}
	.cart-collaterals {
    flex-direction: column-reverse;
}
    .woocommerce-cart-form__contents thead {
        display: none; /* Hide header on mobile */
    }

    .woocommerce-cart-form__contents tr.cart_item {
        display: block;
        width: 100%;
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #e6e6e6;
        border-radius: 10px;
        background: #fff;
		position: relative;
    }

    .woocommerce-cart-form__contents td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border: none !important;
    }

    .woocommerce-cart-form__contents td::before {
        content: attr(data-title);
        font-weight: 600;
        font-size: 14px;
        color: #333;
			min-width:54px;
    }

    /* Thumbnail */
    .product-thumbnail {
        justify-content: center !important;
    }
    .product-thumbnail a img {
        width: 80px;
        height: auto;
    }
    .product-thumbnail::before {
        content: "Product";
        margin-right: 10px;
    }

    /* Remove “×” styling */
    td.product-remove {
        justify-content: flex-end;
    }
    td.product-remove a.remove {
        font-size: 22px;
    }

    /* Quantity input style improvements */
    .product-quantity .quantity {
        width: 120px;
    }

    /* ACTIONS ROW */
    .klb-actions {
        display: block;
        text-align: center;
        padding: 20px 10px;
    }

    .klb-actions .coupon {
        width: 100%;
        margin-bottom: 15px;
    }

    .klb-actions .coupon input {
        width: 100%;
        margin-bottom: 10px;
    }

    .klb-actions button {
        width: 100%;
    }
	
	.product-remove {
	  position: absolute;
	  top: 0;
	  right: 0;
	  height: 0;
	}
	.product-remove a {
	  font-size: 40px !important;
	  color: #d95353;
	}
	
	.cart-plus-minus input {
		width: 100% !important;
	}
	
	.actions.klb-actions {
	  flex-wrap: wrap;
	}
	#coupon_code {
	  width: 100% !important;
	}
	
}

@media (max-width: 991px) {
    body .header-lang.f-right {
        display: block !important;
        position: absolute;
        right: 76px;
        top: -18px;
    }
	div#sticky-header .col-xl-9.col-lg-9.d-none.d-lg-block {
    display: block !important;
		position:absolute;
		top:26px;
}
	.total-price-basket .lbl {
    display: none;
}
	.top-cart-row .dropdown-cart .lnk-cart .items-cart-inner .total-price-basket {
    padding: 9px 10px 9px 15px;
}
	.mean-container a.meanmenu-reveal {
    margin-top: -48px;
}
	div#sticky-header > .container-fluid {
    position: relative;
}
}












/* Fix horizontal scroll in single product description tab */
.single-product 
#tab-description.woocommerce-Tabs-panel {
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Fix long URLs & text */
.single-product 
#tab-description a,
.single-product 
#tab-description p,
.single-product 
#tab-description li {
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Fix tables inside description */
.single-product 
#tab-description table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Fix pre / code blocks if any */
.single-product 
#tab-description pre,
.single-product 
#tab-description code {
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 100%;
}

/* Images, iframes safety */
.single-product 
#tab-description img,
.single-product 
#tab-description iframe {
  max-width: 100%;
  height: auto;
}
table {
    word-break: break-word!important;
    max-width: 100%!important;
}
div#tab-description {
    display: block;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 100%;
}
@media (max-width: 767px) {
  h1.product_title.entry-title {
    font-size: 24px;
    line-height: 1.3;
    margin-top: 12px;
    margin-bottom: 12px;
  }
.mbz-df-block a.action-btn.button.product_type_simple.add_to_cart_button.ajax_add_to_cart.add-to-cart-full {
    width: 100%;
    height: 100%;
    border-radius: 50px;
    line-height: 20px;
    padding: 5px 5px;
}
	section.related.products .product-text h4 {
    padding-bottom: 0px;
}
.klb-product .product-text {
    margin-bottom: 35px!important;
}
}
section.related.products .product-text {
    margin-bottom: 50px;
}
.col-1 {
    flex: 0 0 8.3333333333%;
    max-width: 100%!important;
}
.col-2 {
    flex: 0 0 16.6666666667%;
    max-width: 100%!important;
}
.product-text h4 a {
    line-height: 1em!important;
}
.klb-product .product-text {
    margin-bottom: 20px;
}
.klb-product .product-text {
    margin-top: 20px;
}

.wp-block-woocommerce-add-to-cart-form .variations_button>.single_add_to_cart_button, .wp-block-woocommerce-add-to-cart-form form.cart>.single_add_to_cart_button {
    grid-column: 2/3;
    justify-self: start;
    margin: 20px 0;
}
.product_meta > span {
    display: block;
    padding-bottom: 0;
}
.wp-block-group.is-nowrap.is-layout-flex.wp-container-core-group-is-layout-ad2f72ca.wp-block-group-is-layout-flex {
    flex-direction: column;
}

.wc-block-components-product-sku.wc-block-grid__product-sku.wp-block-woocommerce-product-sku.product_meta.wp-block-post-terms {
    display: flex;
    padding-top: 20px;
}
.wp-block-woocommerce-add-to-cart-form .quantity .qty {
    width: 15.631em!important;
}
.wc-block-add-to-cart-form .input-text {
    padding: 0!important;
}
.wp-block-woocommerce-add-to-cart-form .variations_button>.single_add_to_cart_button, .wp-block-woocommerce-add-to-cart-form form.cart>.single_add_to_cart_button {
    grid-column: 1/3!important;
    justify-self: start;
}
button.buy_now_button {
    margin-left: 0px;
}/* BIOGENIX: show regular + sale price on shop grid, remove price from button */
.woocommerce ul.products li.product .price del {
  display: inline !important;
  opacity: 0.6;
}

.woocommerce ul.products li.product .price ins {
  text-decoration: none;
}

.woocommerce ul.products li.product a.button .amount,
.woocommerce ul.products li.product a.add_to_cart_button .amount {
  display: none !important;
}
/* Global WooCommerce buttons: match PayPal rectangle style */
.woocommerce a.button,
.woocommerce button.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
.woocommerce a.add_to_cart_button,
.woocommerce a.product_type_simple,
.woocommerce a.single_add_to_cart_button,
.woocommerce button.single_add_to_cart_button,
.woocommerce .added_to_cart,
.woocommerce .checkout-button {
    border-radius: 4px !important;   /* PayPal-like rectangle */
}

/* Quantity + Buy Now container buttons */
.woocommerce div.product form.cart .button,
.woocommerce div.product form.cart button {
    border-radius: 4px !important;
}

/* Remove pill styling some themes add */
button,
input[type="submit"] {
    border-radius: 4px !important;
}
/* Global WooCommerce buttons: match PayPal rectangle style */
.woocommerce a.button,
.woocommerce button.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
.woocommerce a.add_to_cart_button,
.woocommerce a.product_type_simple,
.woocommerce a.single_add_to_cart_button,
.woocommerce button.single_add_to_cart_button,
.woocommerce .added_to_cart,
.woocommerce .checkout-button {
    border-radius: 4px !important;   /* PayPal-like rectangle */
}

/* Quantity + Buy Now container buttons */
.woocommerce div.product form.cart .button,
.woocommerce div.product form.cart button {
    border-radius: 4px !important;
}

/* Remove pill styling some themes add */
button,
input[type="submit"] {
    border-radius: 4px !important;
}
/* Global WooCommerce buttons: match PayPal rectangle style */
.woocommerce a.button,
.woocommerce button.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
.woocommerce a.add_to_cart_button,
.woocommerce a.product_type_simple,
.woocommerce a.single_add_to_cart_button,
.woocommerce button.single_add_to_cart_button,
.woocommerce .added_to_cart,
.woocommerce .checkout-button {
    border-radius: 4px !important;   /* PayPal-like rectangle */
}

/* Quantity + Buy Now container buttons */
.woocommerce div.product form.cart .button,
.woocommerce div.product form.cart button {
    border-radius: 4px !important;
}

/* Remove pill styling some themes add */
button,
input[type="submit"] {
    border-radius: 4px !important;
}
/* Quantity input container */
.woocommerce .quantity {
    border-radius: 4px !important; /* match buttons */
}

/* Quantity input field */
.woocommerce .quantity input.qty {
    border-radius: 4px !important;
    background-color: #ffffff !important;
    color: #0a1f44 !important;              /* dark text */
    border: 1px solid #cfd6e0 !important;   /* visible edge *
/* Quantity container */
.woocommerce .quantity {
    border-radius: 4px !important;
}

/* Quantity input */
.woocommerce .quantity input.qty {
    background-color: #ffffff !important;
    color: #0a1f44 !important;            /* deep navy */
    border: 2px solid #0a1f44 !important; /* brand blue */
    opacity: 1 !important;
    font-weight: 600;
    height: 44px;
}

/* Plus / minus buttons */
.woocommerce .quantity .plus,
.woocommerce .quantity .minus {
    background-color: #0a1f44 !important; /* brand blue */
    color: #ffffff !important;
    border: 2px solid #0a1f44 !important;
    height: 44px;
    width: 44px;
    font-weight: 700;
}

/* Hover state */
.woocommerce .quantity .plus:hover,
.woocommerce .quantity .minus:hover {
    background-color: #0e2f66 !important; /* slightly lighter blue */
}
.woocommerce .quantity input.qty {
    background-color: #f9fafc !important;
    border: 2px solid #cfd6e0 !important;
    color: #0a1f44 !important;
}

.woocommerce .quantity .plus,
.woocommerce .quantity .minus {
    background-color: #e9eef6 !important;
    color: #0a1f44 !important;
    border: 2px solid #cfd6e0 !important;
}

.woocommerce .quantity .plus:hover,
.woocommerce .quantity .minus:hover {
    background-color: #dfe7f3 !important;
}
/* FORCE quantity container */
.woocommerce div.product form.cart .quantity {
    background: #ffffff !important;
    border-radius: 4px !important;
    opacity: 1 !important;
}

/* FORCE quantity number field */
.woocommerce div.product form.cart .quantity input[type="number"],
.woocommerce div.product form.cart .quantity input.qty {
    background-color: #f0f6ff !important;   /* light blue fill */
    color: #0a1f44 !important;
    border: 2px solid #0a1f44 !important;
    opacity: 1 !important;
    box-shadow: none !important;
    appearance: textfield !important;
    -webkit-appearance: textfield !important;
    height: 44px !important;
    font-weight: 700;
}

/* FORCE plus/minus buttons */
.woocommerce div.product form.cart .quantity .plus,
.woocommerce div.product form.cart .quantity .minus {
    background-color: #0a1f44 !important;
    color: #ffffff !important;
    border: 2px solid #0a1f44 !important;
    opacity: 1 !important;
    height: 44px !important;
    width: 44px !important;
    font-weight: 800;
}

/* Hover state */
.woocommerce div.product form.cart .quantity .plus:hover,
.woocommerce div.product form.cart .quantity .minus:hover {
    background-color: #0e2f66 !important;
}

/* REMOVE any theme fade/disabled look */
.woocommerce .quantity * {
    opacity: 1 !important;
}
/* Make "Proceed to checkout" match the PayPal button width */
.woocommerce-cart .wc-proceed-to-checkout a.checkout-button{
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
.woocommerce-cart .wc-proceed-to-checkout a.checkout-button{
  min-height: 50px !important;
  line-height: 50px !important;
  padding: 0 18px !important;  /* keeps it clean */
}
.woocommerce-cart .wc-proceed-to-checkout{
  width: 100% !important;
}

.woocommerce-cart .wc-proceed-to-checkout a.checkout-button{
  width: 100% !important;
}
/* CART: force the whole checkout button area to full width */
body.woocommerce-cart .cart_totals .wc-proceed-to-checkout{
  width: 100% !important;
  max-width: 100% !important;
}

/* CART: force Proceed to Checkout button full width */
body.woocommerce-cart .cart_totals .wc-proceed-to-checkout a,
body.woocommerce-cart .cart_totals .wc-proceed-to-checkout a.button,
body.woocommerce-cart .cart_totals .wc-proceed-to-checkout a.checkout-button{
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* If the theme applies a fixed width somewhere */
body.woocommerce-cart .cart_totals .wc-proceed-to-checkout *{
  max-width: 100% !important;
}
/* Extra override for themes that force button sizing */
body.woocommerce-cart a.checkout-button,
body.woocommerce-cart a.button.checkout-button,
body.woocommerce-cart .checkout-button.button,
body.woocommerce-cart .checkout-button.button.alt{
  width: 100% !important;
  display: block !important;
}
/* Checkout: hide PayPal method description text box */
.woocommerce-checkout #payment .payment_method_ppcp-gateway .payment_box,
.woocommerce-checkout #payment .payment_method_paypal .payment_box {
  display: none !important;
}
/* Hide PayPal method description box (if theme forces it) */
#payment .payment_method_ppcp-gateway .payment_box,
#payment .payment_method_paypal .payment_box {
  display: none !important;
}
/* MOBILE: force rectangular buttons everywhere */
@media (max-width: 768px) {

  /* All main action buttons */
  .woocommerce button,
  .woocommerce .button,
  .woocommerce a.button,
  .woocommerce input.button,
  .woocommerce-cart a.checkout-button,
  .single-product .single_add_to_cart_button,
  .single-product .buy-now,
  .single-product a.buy-now,
  .single-product button.buy-now {
    border-radius: 6px !important;
  }

  /* PayPal button container (keeps it uniform) */
  .paypal-button,
  .paypal-button-container,
  .paypal-buttons {
    border-radius: 6px !important;
    overflow: hidden !important;
  }

  /* Quantity box */
  .woocommerce .quantity,
  .woocommerce .quantity .qty,
  .woocommerce .quantity button {
    border-radius: 6px !important;
  }
}
/* MOBILE: force quantity selector to rectangular */
@media (max-width: 768px) {

  /* Quantity wrapper */
  .woocommerce .quantity {
    border-radius: 6px !important;
    overflow: hidden !important;
  }

  /* Minus / Plus buttons */
  .woocommerce .quantity button,
  .woocommerce .quantity .minus,
  .woocommerce .quantity .plus {
    border-radius: 0 !important;
    background-color: #0a1f66 !important; /* Biogenix blue */
    color: #ffffff !important;
    opacity: 1 !important;
  }

  /* Quantity input field */
  .woocommerce .quantity .qty {
    border-radius: 0 !important;
    background-color: #ffffff !important;
    color: #0a1f66 !important;
    font-weight: 700;
  }
}
/* MOBILE: force quantity selector to rectangular */
@media (max-width: 768px) {

  /* Quantity wrapper */
  .woocommerce .quantity {
    border-radius: 6px !important;
    overflow: hidden !important;
  }

  /* Minus / Plus buttons */
  .woocommerce .quantity button,
  .woocommerce .quantity .minus,
  .woocommerce .quantity .plus {
    border-radius: 0 !important;
    background-color: #0a1f66 !important; /* Biogenix blue */
    color: #ffffff !important;
    opacity: 1 !important;
  }

  /* Quantity input field */
  .woocommerce .quantity .qty {
    border-radius: 0 !important;
    background-color: #ffffff !important;
    color: #0a1f66 !important;
    font-weight: 700;
  }
}
/* === QUANTITY (match PC look) === */
@media (max-width: 768px){

  /* Kill any weird mobile wrapper styling (pink, pill, shadows) */
  .woocommerce .quantity,
  .woocommerce div.quantity,
  .woocommerce form.cart .quantity,
  .single-product form.cart .quantity,
  .woocommerce .quantity * {
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 6px !important;
  }

  /* Force the visible quantity container to white + rectangle */
  .woocommerce .quantity,
  .woocommerce form.cart .quantity,
  .single-product form.cart .quantity,
  .qib-container,
  .wqpmbuttons,
  .quantity-nav {
    background: #ffffff !important;
    border: 1px solid #cfd6e4 !important;
    border-radius: 6px !important;
    overflow: hidden !important;
  }

  /* The number input itself */
  .woocommerce .quantity input.qty,
  .woocommerce .quantity .qty,
  .woocommerce .quantity input[type="number"],
  .qib-container input,
  .wqpmbuttons input {
    background: #ffffff !important;
    color: #0a1f66 !important;
    font-weight: 700 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    height: 52px !important;
    line-height: 52px !important;
  }

  /* Plus / minus buttons (covers multiple implementations) */
  .woocommerce .quantity button,
  .woocommerce .quantity .plus,
  .woocommerce .quantity .minus,
  .qib-button,
  .qib-button-minus,
  .qib-button-plus,
  .wqpmbuttons button,
  .quantity-button,
  .quantity-nav .quantity-button {
    background: #0a1f66 !important;
    color: #ffffff !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    opacity: 1 !important;
    height: 52px !important;
    width: 52px !important;
    line-height: 52px !important;
  }

  /* If theme is rounding the ends */
  .woocommerce .quantity button:first-child,
  .woocommerce .quantity button:last-child,
  .woocommerce .quantity .minus,
  .woocommerce .quantity .plus {
    border-radius: 0 !important;
  }
}
@media (max-width: 768px){
  .woocommerce .quantity:before,
  .woocommerce .quantity:after,
  .qib-container:before,
  .qib-container:after,
  .wqpmbuttons:before,
  .wqpmbuttons:after {
    display: none !important;
    content: none !important;
  }
}


}/* Hide WooPayments credit card form but keep Apple Pay / Google Pay */
.wc_payment_method.payment_method_woocommerce_payments .payment_box {
display:none !important;
}/* Hide WooPayments card option completely */
li.wc_payment_method.payment_method_woocommerce_payments {
    display: none !important;
}

/* Hide ACH too if it is attached under WooPayments */
.wc-block-components-radio-control-accordion-option:has(.wc-block-components-payment-method-label),
.wc_payment_method.payment_method_woocommerce_payments_ach {
    display: none !important;
}/* Move Apple Pay / Google Pay buttons into payment section */
#wcpay-payment-request-wrapper {
    margin-top: 25px;
}

/* Hide the OR separator above billing */
#wcpay-payment-request-wrapper + .woocommerce-form-login-toggle,
#wcpay-payment-request-wrapper + .woocommerce-checkout {
    margin-top: 0;
}.woocommerce-store-notice__dismiss-link {
display: none !important;
}

/*checkout notices*/
/* ── WooCommerce Checkout Error Notice ─────────────────────────────── */

.woocommerce-NoticeGroup-checkout {
  margin: 0 0 24px;
  animation: slideDownFade 0.4s ease both;
}

@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.woocommerce-NoticeGroup-checkout .woocommerce-error {
  position: relative;

  background-color: #fff5f5;
  border: 1.5px solid #e2401c;
  border-left: 5px solid #e2401c;
  border-radius: 6px;

  padding: 16px 20px;
  margin: 0;
  list-style: none;

  color: #7a1a05;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.6;

  box-shadow:
    0 2px 8px rgba(226, 64, 28, 0.12),
    0 0 0 4px rgba(226, 64, 28, 0.06);
}

/* Warning icon via ::before */
.woocommerce-NoticeGroup-checkout .woocommerce-error::before {
  content: "⚠";
  flex-shrink: 0;
  font-size: 1.25rem;
  line-height: 1.4;
  color: #e2401c;
}

/* Link inside the error */
.woocommerce-NoticeGroup-checkout .woocommerce-error a {
  color: #e2401c;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.woocommerce-NoticeGroup-checkout .woocommerce-error a:hover {
  color: #b5300f;
  text-decoration: none;
}

/* Pulsing left border to draw the eye */
@keyframes pulseBorder {
  0%, 100% { border-left-color: #e2401c; }
  50%       { border-left-color: #ff6b45; }
}

.woocommerce-NoticeGroup-checkout .woocommerce-error {
  animation:
    slideDownFade 0.4s ease both,
    pulseBorder   1.8s ease-in-out 0.4s 3; /* pulses 3x then stops */
}

/* Mobile */
@media (max-width: 600px) {
  .woocommerce-NoticeGroup-checkout .woocommerce-error {
    font-size: 0.88rem;
    padding: 14px 16px;
  }
}
/*checkout notice end*/
/* Discount bar stays on top */
.discount-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9999;
}

/* Trustpilot stays below */
.trustpilot-widget {
  position: relative;
  z-index: 1;
}.slides .description {
    white-space: pre-line;
}.slides .description {
    max-width: 320px; /* adjust this */
    line-height: 1.4;
}.slides .description {
    max-width: 320px;
}
.single-product .woocommerce-tabs ul.tabs li a {
  background: #f3f3f3 !important;
  border: 1px solid #ddd !important;
  border-radius: 999px !important;
  padding: 12px 24px !important;
  margin-right: 12px !important;
  display: inline-block !important;
}

.single-product .woocommerce-tabs ul.tabs li.active a {
  background: #ffffff !important;
  border: 2px solid #0b2388 !important;
  color: #0b2388 !important;
}.single-product .woocommerce-tabs ul.tabs li a {
  background: #f3efff !important;   /* light lavender */
  border: 1px solid #d6ccff !important;
  border-radius: 999px !important;
  padding: 12px 24px !important;
  margin-right: 12px !important;
  display: inline-block !important;
  color: #2b2b2b !important;
}

.single-product .woocommerce-tabs ul.tabs li.active a {
  background: #e6ddff !important;   /* slightly darker lavender */
  border: 2px solid #6a5cff !important; /* brand purple */
  color: #4b3fd6 !important;
}@media (max-width: 768px) {
  .single-product iframe,
  .single-product embed,
  .single-product object {
    display: none !important;
  }

  .coa-mobile-button {
    display: inline-block !important;
    background: #efe9ff !important;
    color: #4b3fd6 !important;
    padding: 14px 22px !important;
    border-radius: 999px !important;
    font-weight: 700 !important;
    text-decoration: none !important;
    margin-bottom: 12px !important;
  }
}/* Research Use Only pill */
.sale-tag,
.woocommerce .onsale {
    background: linear-gradient(90deg, #7B2CFF, #D414FF) !important;
    border-radius: 50px !important;
    padding: 6px 14px !important;
}		</style>
		<style id="kirki-inline-styles">.logo img{width:180px;}.shop-menu ul li a{font-size:15px;}.main-menu ul li a{font-size:16px;}.footer-wrapper{padding-top:0px;padding-bottom:0px;}h3.footer-title{font-size:20px;}.footer-area p, .klbfooterwidget ul li a, .footer-icon a{font-size:15px;}.footer-bottom-link ul li a, .copyright p{font-size:15px;}</style>    <!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1219726330086095');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1219726330086095&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
</head>

<body data-cmplz=1 class="home wp-singular page-template-default page page-id-21 wp-theme-medibazar wp-child-theme-medibazar-child theme-medibazar woocommerce-no-js elementor-default elementor-kit-9 elementor-page elementor-page-21">

<div id="preloader"></div>

		
			
	<header>
									<div class="header-top-area pl-165 pr-165">
				<div class="container-fluid">
					<div class="row">
						<div class="col-xl-8 col-lg-6 col-md-6">
							<div class="header-top-wrapper">
								<div class="header-top-info d-none d-xl-block f-left">
									<span></span>
								</div>
								<div class="header-link f-left">
									<span></span>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-6">
							<div class="header-top-right text-md-right">
							   <div class="shop-menu">
									<ul id="menu-top-right" class="header_right"><li id="menu-item-460" class="fa-lock menu-item menu-item-type-post_type menu-item-object-page menu-item-460"><a href="https://biogenixpeptides.com/my-account/">Login / Register</a></li>
</ul>							   </div>
							</div>
						</div>
																			<div class="col-md-12">
								<div class="mobile-search"> 
									<form class="header-search-form" action="https://biogenixpeptides.com/" role="search" method="get" id="searchform">
				<input type="text" value="" name="s" id="s" placeholder="Search">
				<button type="submit"><i class="far fa-search"></i></button>
                <input type="hidden" name="post_type" value="product" />
			</form>								</div>
							</div>
											</div>
				</div>
			</div>
					
		<div id="sticky-header" class="main-menu-area menu-01 pl-165 pr-165">
			<div class="container-fluid">
				<div class="row align-items-center">
					<div class="col-xl-3 col-lg-3">
						<div class="logo">
															<a href="https://biogenixpeptides.com/" title="BioGenix Peptides™">
									<img class="logo_dark" src="https://biogenixpeptides.com/wp-content/uploads/2026/03/BGX-Website-Logo.png"  alt="BioGenix Peptides™">
								</a>
													</div>
					</div>
					<div class="col-xl-9 col-lg-9 d-none d-lg-block">
						<div class="header-right f-right">
						
							
	<div class="header-lang f-right pos-rel d-none d-md-none d-lg-block">
						
		<div class="top-cart-row">
			<div class="dropdown dropdown-cart"> 
				<a href="#" class="dropdown-toggle lnk-cart" data-toggle="dropdown">
				<div class="items-cart-inner">
				  <div class="basket"> <i class="fal fa-shopping-cart"></i> </div>
				  <div class="basket-item-count"><span class="cart-count">0</span></div>
				  <div class="total-price-basket"> <span class="lbl">My Cart</span>  </div>
				</div>
				</a>
				<div class="dropdown-menu">
					<div class="fl-mini-cart-content">
						

	<p class="woocommerce-mini-cart__empty-message">No products in the cart.</p>


					</div>
				</div>
			</div>
		</div>
	</div>
							
																					
							<div class="header-search f-right d-none d-xl-block">
	<form class="header-search-form" action="https://biogenixpeptides.com/" role="search" method="get" id="searchform">
				<input type="text" value="" name="s" id="s" placeholder="Search">
				<button type="submit"><i class="far fa-search"></i></button>
                <input type="hidden" name="post_type" value="product" />
			</form></div>

						</div>
						<div class="main-menu">
							<nav id="mobile-menu">
								<ul id="menu-menu-1" class=""><li class=" menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item active"><a href="/"  >Home</a></li>
<li class="dropdown  menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children"><a href="https://biogenixpeptides.com/about/"  >About Us</a>
<ul class="sub-menu text-left">
	<li class=" menu-item menu-item-type-post_type menu-item-object-page"><a href="https://biogenixpeptides.com/faq/"  >FAQ</a></li>
</ul>
</li>
<li class="dropdown  menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children"><a href="https://biogenixpeptides.com/shop/"  >Shop</a>
<ul class="sub-menu text-left">
	<li class=" menu-item menu-item-type-post_type menu-item-object-page"><a href="https://biogenixpeptides.com/shop/"  >View All</a></li>
	<li class=" menu-item menu-item-type-post_type menu-item-object-page"><a href="https://biogenixpeptides.com/best-sellers/"  >Best Sellers</a></li>
</ul>
</li>
<li class=" menu-item menu-item-type-post_type menu-item-object-page"><a href="https://biogenixpeptides.com/blog/"  >Research Library</a></li>
<li class=" menu-item menu-item-type-post_type menu-item-object-page"><a href="https://biogenixpeptides.com/contact-us/"  >Contact Us</a></li>
</ul>							</nav>
						</div>
					</div>
					<div class="col-12">
						<div class="mobile-menu"></div>
					</div>
				</div>
			</div>
		</div>
		
			</header>
		
			
	
	<main>
	 

	
				  
									<div data-elementor-type="wp-page" data-elementor-id="21" class="elementor elementor-21" data-elementor-post-type="page">
						<section class="elementor-section elementor-top-section elementor-element elementor-element-6451a63 elementor-section-full_width elementor-section-stretched elementor-section-height-default elementor-section-height-default" data-id="6451a63" data-element_type="section" data-e-type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
							<div class="elementor-background-overlay"></div>
							<div class="elementor-container elementor-column-gap-no">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-37c82ef" data-id="37c82ef" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-24237dd elementor-widget elementor-widget-medibazar-home-slider-2" data-id="24237dd" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-home-slider-2.default">
				<div class="elementor-widget-container">
					<section class="hero-area"><div class="hero-slider"><div class="slider-active"><div class="single-slider slider-2-height d-flex align-items-center" data-background=""><div class="container"><div class="row"><div class="col-xl-6 col-lg-7 col-md-9"><div class="hero-content"><div class="slider-caption "><span data-animation="fadeInUp" data-delay=".2s">BioGenix Peptides™</span><h2 data-animation="fadeInUp" data-delay=".4s">Research Use Only</h2><p data-animation="fadeInUp" data-delay=".6s">Driven by Science.
Defined by Purity.</p></div><div class="hero-02-slider-btn"><a data-animation="fadeInUp" data-delay=".8s" href="https://biogenixpeptides.com/shop/"  class="c-btn red-btn">shop now <i class="far fa-plus"></i></a></div></div></div><div class="col-xl-6 col-lg-5"><div class="slider-02-img" data-animation="fadeInRight" data-delay=".8s"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/03/Home-page-slider-1.png" alt="banner"></div></div></div></div></div><div class="single-slider slider-2-height d-flex align-items-center" data-background=""><div class="container"><div class="row"><div class="col-xl-6 col-lg-7 col-md-9"><div class="hero-content"><div class="slider-caption "><span data-animation="fadeInUp" data-delay=".2s">Engineered for Research.</span><h2 data-animation="fadeInUp" data-delay=".4s"> Verified for Purity.</h2><p data-animation="fadeInUp" data-delay=".6s"> Trusted for Results.</p></div><div class="hero-02-slider-btn"><a data-animation="fadeInUp" data-delay=".8s" href="https://biogenixpeptides.com/shop/"  class="c-btn red-btn">shop now <i class="far fa-plus"></i></a></div></div></div><div class="col-xl-6 col-lg-5"><div class="slider-02-img" data-animation="fadeInRight" data-delay=".8s"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/03/Home-page-slider-2.png" alt="banner"></div></div></div></div></div><div class="single-slider slider-2-height d-flex align-items-center" data-background=""><div class="container"><div class="row"><div class="col-xl-6 col-lg-7 col-md-9"><div class="hero-content"><div class="slider-caption "><span data-animation="fadeInUp" data-delay=".2s"></span><h2 data-animation="fadeInUp" data-delay=".4s"> Driven by Science.</h2><p data-animation="fadeInUp" data-delay=".6s"> Defined by Purity.</p></div><div class="hero-02-slider-btn"><a data-animation="fadeInUp" data-delay=".8s" href="https://biogenixpeptides.com/shop/"  class="c-btn red-btn">shop now <i class="far fa-plus"></i></a></div></div></div><div class="col-xl-6 col-lg-5"><div class="slider-02-img" data-animation="fadeInRight" data-delay=".8s"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/03/Home-page-slider-3.png" alt="banner"></div></div></div></div></div></div></div></section>				</div>
				</div>
					</div>
		</div>
					</div>
		</section>
		<div class="elementor-element elementor-element-db6118d e-flex e-con-boxed e-con e-parent" data-id="db6118d" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-37d4907 e-grid e-con-boxed e-con e-child" data-id="37d4907" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-508f51b elementor-position-left elementor-vertical-align-middle elementor-widget__width-initial elementor-widget elementor-widget-image-box" data-id="508f51b" data-element_type="widget" data-e-type="widget" data-widget_type="image-box.default">
					<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img fetchpriority="high" decoding="async" width="301" height="301" src="https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP.png" class="attachment-full size-full wp-image-1544" alt="ICONS-GMP | | Research Grade Peptides | BioGenix Peptides™" srcset="https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP.png 301w, https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP-90x90.png 90w, https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP-54x54.png 54w, https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP-150x150.png 150w" sizes="(max-width: 301px) 100vw, 301px" /></figure><div class="elementor-image-box-content"><h6 class="elementor-image-box-title">STRICT SAFETY & QUALITY STANDARDS. GUARANTEED PREMIER COMPOUNDS.</h6></div></div>				</div>
				<div class="elementor-element elementor-element-e0a2619 elementor-position-left elementor-vertical-align-middle elementor-widget__width-initial elementor-widget elementor-widget-image-box" data-id="e0a2619" data-element_type="widget" data-e-type="widget" data-widget_type="image-box.default">
					<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="301" height="301" src="https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-565.png" class="attachment-full size-full wp-image-1545" alt="icon-565 | | Research Grade Peptides | BioGenix Peptides™" srcset="https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-565.png 301w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-565-90x90.png 90w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-565-54x54.png 54w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-565-150x150.png 150w" sizes="(max-width: 301px) 100vw, 301px" /></figure><div class="elementor-image-box-content"><h6 class="elementor-image-box-title">U.S. LABORATORY 3RD PARTY HPLC/MS TESTING & VERIFICATION. PURITY 99%. COAs</h6></div></div>				</div>
				<div class="elementor-element elementor-element-3307f0d elementor-position-left elementor-vertical-align-middle elementor-widget__width-initial elementor-widget elementor-widget-image-box" data-id="3307f0d" data-element_type="widget" data-e-type="widget" data-widget_type="image-box.default">
					<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img loading="lazy" decoding="async" width="301" height="301" src="https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-6656.png" class="attachment-full size-full wp-image-1546" alt="icon-6+656 | | Research Grade Peptides | BioGenix Peptides™" srcset="https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-6656.png 301w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-6656-90x90.png 90w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-6656-54x54.png 54w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-6656-150x150.png 150w" sizes="(max-width: 301px) 100vw, 301px" /></figure><div class="elementor-image-box-content"><h6 class="elementor-image-box-title">SAME DAY SHIPPING ON ORDERS BEFORE 2PM EST. FREE SHIPPING ON ORDERS OVER $200</h6></div></div>				</div>
				<div class="elementor-element elementor-element-90534ff elementor-position-left elementor-vertical-align-middle elementor-widget__width-initial elementor-widget elementor-widget-image-box" data-id="90534ff" data-element_type="widget" data-e-type="widget" data-widget_type="image-box.default">
					<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img loading="lazy" decoding="async" width="294" height="294" src="https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-656.png" class="attachment-full size-full wp-image-1547" alt="icon-656 | | Research Grade Peptides | BioGenix Peptides™" srcset="https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-656.png 294w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-656-90x90.png 90w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-656-54x54.png 54w, https://biogenixpeptides.com/wp-content/uploads/2025/12/icon-656-150x150.png 150w" sizes="(max-width: 294px) 100vw, 294px" /></figure><div class="elementor-image-box-content"><h6 class="elementor-image-box-title">100% SECURE CHECKOUT ON ALL ORDERS. SAFE PAYMENTS & ENCRYPTED DATA.</h6></div></div>				</div>
					</div>
				</div>
					</div>
				</div>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-8b329ea elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="8b329ea" data-element_type="section" data-e-type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-extended">
					<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-4cbb1f7" data-id="4cbb1f7" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-ba233c6 elementor-position-top elementor-widget elementor-widget-image-box" data-id="ba233c6" data-element_type="widget" data-e-type="widget" data-widget_type="image-box.default">
					<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img fetchpriority="high" decoding="async" width="301" height="301" src="https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP.png" class="attachment-full size-full wp-image-1544" alt="ICONS-GMP | | Research Grade Peptides | BioGenix Peptides™" srcset="https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP.png 301w, https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP-90x90.png 90w, https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP-54x54.png 54w, https://biogenixpeptides.com/wp-content/uploads/2025/12/ICONS-GMP-150x150.png 150w" sizes="(max-width: 301px) 100vw, 301px" /></figure><div class="elementor-image-box-content"><p class="elementor-image-box-title">Strict Safety & Quality Standards. Guaranteed Premier Compounds.</p></div></div>				</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-c3cd3b2" data-id="c3cd3b2" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-824379a elementor-widget elementor-widget-medibazar-icon-box" data-id="824379a" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-icon-box.default">
				<div class="elementor-widget-container">
					<div class="features-wrapper"><div class="features-icon fe-1 f-left" style="color:#4e97fd"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 50.8 55.77"><defs><style>.cls-1{fill:none;stroke:#021981;stroke-miterlimit:10;stroke-width:.22px;}.cls-2{fill:#021981;}.cls-2,.cls-3{stroke-width:0px;}.cls-3{fill:#fff;}</style></defs><path class="cls-2" d="m42.47,44.99l-7.46-12.66h-18.88l-7.42,12.66c-.29.45-1.83,2.67-1.83,3.28,0,1.45,3.76,1.16,4.96,1.16h27.52c1.2,0,4.96.29,4.96-1.16,0-.61-1.54-2.83-1.83-3.28"></path><path class="cls-2" d="m43.63,51.56H7.55c-1.87,0-3.4-1.53-3.4-3.4,0-.76.24-1.47.7-2.07l15.1-24.63v-10.34h-.01c-1.09,0-1.98-.89-1.98-1.98v-3.23c0-1.09.89-1.98,1.98-1.98h11.3c1.09,0,1.98.89,1.98,1.98v3.23c0,1.09-.89,1.98-1.98,1.98h-.01v10.37l15.02,24.5c.51.61.78,1.38.78,2.17,0,1.87-1.53,3.4-3.4,3.4ZM19.94,5.21c-.39,0-.71.32-.71.71v3.23c0,.39.32.71.71.71h1.28v11.97l-15.33,25-.02.03c-.3.38-.45.83-.45,1.31,0,1.17.95,2.13,2.13,2.13h36.08c1.17,0,2.13-.95,2.13-2.13,0-.51-.18-1-.51-1.38l-.03-.04-.03-.04-15.23-24.84v-12h1.28c.39,0,.71-.32.71-.71v-3.23c0-.39-.32-.71-.71-.71h-11.3Z"></path><path class="cls-1" d="m43.63,51.56H7.55c-1.87,0-3.4-1.53-3.4-3.4,0-.76.24-1.47.7-2.07l15.1-24.63v-10.34h-.01c-1.09,0-1.98-.89-1.98-1.98v-3.23c0-1.09.89-1.98,1.98-1.98h11.3c1.09,0,1.98.89,1.98,1.98v3.23c0,1.09-.89,1.98-1.98,1.98h-.01v10.37l15.02,24.5c.51.61.78,1.38.78,2.17,0,1.87-1.53,3.4-3.4,3.4ZM19.94,5.21c-.39,0-.71.32-.71.71v3.23c0,.39.32.71.71.71h1.28v11.97l-15.33,25-.02.03c-.3.38-.45.83-.45,1.31,0,1.17.95,2.13,2.13,2.13h36.08c1.17,0,2.13-.95,2.13-2.13,0-.51-.18-1-.51-1.38l-.03-.04-.03-.04-15.23-24.84v-12h1.28c.39,0,.71-.32.71-.71v-3.23c0-.39-.32-.71-.71-.71h-11.3Z"></path><path class="cls-2" d="m30.86,31.92c0,1.25-1.02,2.27-2.27,2.27s-2.27-1.02-2.27-2.27,1.02-2.27,2.27-2.27,2.27,1.02,2.27,2.27"></path><path class="cls-2" d="m23.94,26.56c0,1-.81,1.81-1.81,1.81s-1.81-.81-1.81-1.81.81-1.81,1.81-1.81,1.81.81,1.81,1.81"></path><path class="cls-2" d="m28.14,20.78c0,1-.81,1.81-1.81,1.81s-1.81-.81-1.81-1.81.81-1.81,1.81-1.81,1.81.81,1.81,1.81"></path><path class="cls-3" d="m23.06,35.57c0,.52-.42.94-.94.94s-.94-.42-.94-.94.42-.94.94-.94.94.42.94.94"></path><path class="cls-3" d="m30.08,37.64c0,.46-.38.84-.84.84s-.84-.38-.84-.84.38-.84.84-.84.84.38.84.84"></path><path class="cls-3" d="m27.59,40.31c0,1.01-.82,1.82-1.82,1.82s-1.82-.82-1.82-1.82.82-1.82,1.82-1.82,1.82.82,1.82,1.82"></path></svg></div><div class="features-text"><h3></h3><p>U.S. Laboratory
3rd Party HPLC/MS
Testing & Verification.
Purity 99%+</p></div></div>				</div>
				</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-3b28440" data-id="3b28440" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-c13b3b2 elementor-widget elementor-widget-medibazar-icon-box" data-id="c13b3b2" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-icon-box.default">
				<div class="elementor-widget-container">
					<div class="features-wrapper"><div class="features-icon fe-1 f-left" style="color:#4e97fd"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 77.85 73.21"><defs><style>.cls-1{fill:#021981;fill-rule:evenodd;stroke-width:0px;}</style></defs><path class="cls-1" d="m18.86,42.51l-13.83,8.82c-.71.45-.84,1.35-.47,2.1h0c.38.75,1.4.92,2.1.47,4.62-2.94,9.22-5.88,13.83-8.82,1.9-1.21.17-3.72-1.64-2.57m.4,6.97l-13.81,8.81c-.71.45-.92,1.4-.47,2.1.45.71,1.4.92,2.1.47l13.82-8.81c.71-.45.91-1.4.46-2.1-.45-.71-1.4-.92-2.1-.47Zm6.81,2.65l-12.43,7.93c-.71.45-.84,1.35-.47,2.1h0c.37.75,1.4.92,2.1.47,4.65-2.97,9.15-5.84,13.77-8.78l4.03,2.32-1.18-7.19c-3.58.89-6.06,1.42-6.06,1.42,2.16-2.45,1.5-1.58,4.19-4.65l-6.1-5v10.14l2.15,1.24Zm3.45,5.09c-3.73,2.46-7.49,4.78-11.27,7.19-.71.45-.92,1.4-.47,2.1h0c.45.71,1.4.92,2.1.47,3.76-2.4,7.51-4.8,11.27-7.19,2.07-1.32-.02-3.64-1.64-2.57Zm8.5,1.81l-4.71,3h0s-.03.02-.05.03h0s0,0,0,0h0s0,0,0,0l-14.01,8.94c-.71.45-.92,1.4-.47,2.1.45.71,1.4.92,2.1.47l12.53-7.99h.02s2.88-1.83,2.88-1.83h-.02s3.85-2.46,3.85-2.46c.28-.17.48-.42.59-.71l6.67,3.85,6.72-3.88c-1.09-9.35-3.87-16.17-5.93-19.69-6.82,4.09-10.91,6.43-12.27,7-.51,3.76-.85,6.23-1.01,7.4-.07.52-.32.95-.75,1.27l-.2.15,1.69.98,2.36,1.36Zm-27.82,3.21l-2.62,1.67c-1.91,1.21-.63,4.01,1.64,2.57l2.62-1.67c2.09-1.33.19-3.74-1.64-2.57Zm13.46-30.02c-5.33,3.4-10.64,6.81-15.97,10.2-.71.45-.92,1.4-.47,2.1.45.71,1.4.92,2.1.47,4.87-3.11,9.71-6.22,14.59-9.32v4.63l.69-.3c.49-.21.98-.21,1.47-.01,1.09.45,3.4,1.39,6.91,2.83,1.18-.89,5.24-3.26,12.2-7.13-1.94-3.43-6.87-9.72-14.91-15.59l-6.37,3.68v8.3c-.09.04-.17.08-.26.13ZM47.39,1l15.73,9.08,15.73,9.08v36.33l-15.73,9.08-15.73,9.08-8.05-4.65-.03.02-7.75,4.94c-.71.45-1.65.24-2.1-.46-.45-.71-.24-1.65.47-2.1l7.75-4.94c.06-.04.12-.07.19-.1l1.41-.9,8.12,4.69,14.22-8.21,14.21-8.21V20.91l-14.21-8.21-14.22-8.21-14.21,8.21-14.22,8.21v10.77c-.13.04-.26.1-.38.18-4.97,3.17-9.94,6.35-14.93,9.51-2.13,1.36-3.81-1.18-1.64-2.57l13.92-8.88v-10.77l15.73-9.08L47.39,1Zm0,9.23l11.74,6.78,11.74,6.78v27.1l-11.74,6.78-3.79,2.19c.57-2.97.94-8.51,1.11-16.62l2.93-1.64c.15-.09.26-.22.3-.38.05-.17.03-.33-.06-.49-.27-.47-.49-.85-.64-1.12-.17-.3-.56-.41-.87-.24l-1.61.92c.02-1.29.03-2.64.04-4.04,7.47-3.87,11.9-7.94,13.37-11.28.06-.14.05-.3-.03-.43-.08-.14-.21-.22-.37-.23-3.59-.34-9.04,1.96-16.13,6.49-1.24-.71-2.43-1.38-3.58-2.02l1.63-.95c.3-.18.41-.57.23-.87-.16-.27-.38-.64-.65-1.12-.09-.15-.22-.25-.39-.3-.17-.04-.33-.02-.48.07l-2.92,1.73c-8.21-4.51-13.58-7.07-16.1-7.68h-.03s4.56-2.63,4.56-2.63l11.74-6.78Z"></path></svg></div><div class="features-text"><h3></h3><p>Same Day Shipping on
Orders Before 2pm EST.
Free Shipping on
Orders Over $200</p></div></div>				</div>
				</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-bac6d70" data-id="bac6d70" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-cd0cdfc elementor-widget elementor-widget-medibazar-icon-box" data-id="cd0cdfc" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-icon-box.default">
				<div class="elementor-widget-container">
					<div class="features-wrapper"><div class="features-icon fe-1 f-left" style="color:#E4573D"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 204 143" preserveAspectRatio="xMidYMid meet"><path d="M0 0 C67.32 0 134.64 0 204 0 C204 47.19 204 94.38 204 143 C136.68 143 69.36 143 0 143 C0 95.81 0 48.62 0 0 Z " fill="#051C83" transform="translate(0,0)"></path><path d="M0 0 C67.32 0 134.64 0 204 0 C204 47.19 204 94.38 204 143 C136.68 143 69.36 143 0 143 C0 95.81 0 48.62 0 0 Z M148.75 8.812 C139.701 12.678 130.775 14.893 121 16 C119.766 17.014 119.766 17.014 119.867 19.109 C119.871 20.416 119.871 20.416 119.875 21.75 C119.872 22.611 119.87 23.472 119.867 24.359 C120 27 120.456 29.417 121 32 C120.136 31.999 120.136 31.999 119.254 31.997 C105.25 31.975 91.246 31.959 77.243 31.948 C70.471 31.943 63.699 31.936 56.927 31.925 C50.398 31.914 43.869 31.908 37.339 31.905 C34.842 31.903 32.345 31.9 29.848 31.894 C26.363 31.887 22.879 31.886 19.395 31.886 C18.351 31.883 17.307 31.879 16.232 31.876 C15.288 31.877 14.345 31.878 13.372 31.88 C12.547 31.879 11.722 31.878 10.872 31.877 C8.986 31.794 8.986 31.794 8 33 C7.899 36.161 7.864 39.3 7.871 42.461 C7.869 43.454 7.867 44.448 7.865 45.471 C7.861 48.773 7.864 52.074 7.867 55.375 C7.867 57.658 7.866 59.941 7.864 62.224 C7.863 67.016 7.865 71.808 7.87 76.6 C7.875 82.757 7.872 88.915 7.866 95.072 C7.862 99.789 7.864 104.505 7.866 109.221 C7.867 111.493 7.866 113.764 7.864 116.035 C7.861 119.203 7.865 122.371 7.871 125.539 C7.869 126.488 7.867 127.436 7.864 128.414 C7.455 132.532 7.455 132.532 9 136 C10.972 136.099 12.948 136.126 14.922 136.127 C16.853 136.131 16.853 136.131 18.823 136.136 C20.263 136.134 21.703 136.132 23.143 136.129 C24.648 136.131 26.154 136.133 27.66 136.135 C31.761 136.139 35.862 136.137 39.964 136.134 C44.246 136.132 48.528 136.134 52.811 136.136 C60.004 136.138 67.196 136.135 74.389 136.13 C82.717 136.125 91.045 136.127 99.373 136.132 C106.51 136.137 113.647 136.137 120.785 136.135 C125.053 136.133 129.321 136.133 133.59 136.136 C137.602 136.139 141.614 136.137 145.626 136.131 C147.102 136.13 148.579 136.13 150.056 136.133 C152.063 136.135 154.071 136.131 156.078 136.127 C157.204 136.127 158.33 136.126 159.49 136.126 C161.939 136.284 161.939 136.284 163 135 C163.093 133.618 163.117 132.232 163.114 130.847 C163.113 129.967 163.113 129.086 163.113 128.178 C163.108 127.221 163.103 126.264 163.098 125.277 C163.096 124.302 163.095 123.327 163.093 122.322 C163.088 119.194 163.075 116.066 163.062 112.938 C163.057 110.822 163.053 108.707 163.049 106.592 C163.038 101.395 163.021 96.197 163 91 C163.605 90.717 164.21 90.435 164.833 90.143 C181.946 81.113 191.709 58.287 197.812 41.125 C200.315 32.983 201.121 25.494 201 17 C200.412 16.88 199.824 16.76 199.219 16.636 C188.118 14.335 177.597 11.929 167.289 7.137 C160.284 4.716 155.36 5.873 148.75 8.812 Z " fill="#FDFDFE" transform="translate(0,0)"></path><path d="M0 0 C31.495 -0.605 31.495 -0.605 44.768 -0.732 C53.907 -0.821 63.044 -0.925 72.181 -1.132 C78.838 -1.282 85.494 -1.378 92.152 -1.411 C95.673 -1.431 99.19 -1.476 102.709 -1.586 C126.922 -2.316 126.922 -2.316 135.261 5.42 C137.654 8.001 139.843 10.651 141.864 13.533 C142.952 15.156 142.952 15.156 145 16 C145 29.2 145 42.4 145 56 C97.15 56 49.3 56 0 56 C0 37.52 0 19.04 0 0 Z " fill="#FCFCFD" transform="translate(13,75)"></path><path d="M0 0 C8.473 3.478 17.279 5.054 26.25 6.75 C27.488 30.966 16.143 50.118 0.426 67.559 C-5.476 73.503 -5.476 73.503 -9.266 74.238 C-18.017 72.518 -25.775 60.565 -30.75 53.75 C-32.61 50.831 -34.199 47.841 -35.75 44.75 C-36.169 44.018 -36.588 43.286 -37.02 42.531 C-43.043 31.612 -45.282 19.104 -45.75 6.75 C-44.541 6.519 -43.332 6.289 -42.086 6.051 C-32.978 4.255 -24.443 2.226 -15.828 -1.297 C-9.945 -3.118 -5.53 -2.481 0 0 Z " fill="#041B82" transform="translate(169.75,13.25)"></path><path d="M0 0 C36.3 0 72.6 0 110 0 C114 12 114 12 114 14 C76.38 14 38.76 14 0 14 C0 9.38 0 4.76 0 0 Z " fill="#F6F7FA" transform="translate(13,37)"></path><path d="M0 0 C8.473 3.478 17.279 5.054 26.25 6.75 C27.488 30.966 16.143 50.118 0.426 67.559 C-5.476 73.503 -5.476 73.503 -9.266 74.238 C-18.017 72.518 -25.775 60.565 -30.75 53.75 C-32.61 50.831 -34.199 47.841 -35.75 44.75 C-36.169 44.018 -36.588 43.286 -37.02 42.531 C-43.043 31.612 -45.282 19.104 -45.75 6.75 C-44.541 6.519 -43.332 6.289 -42.086 6.051 C-32.978 4.255 -24.443 2.226 -15.828 -1.297 C-9.945 -3.118 -5.53 -2.481 0 0 Z M-18.75 3.062 C-26.305 5.768 -33.849 7.371 -41.75 8.75 C-42.39 27.761 -35.847 44.675 -23.312 59 C-17.539 65.477 -17.539 65.477 -10.75 70.75 C-4.275 70.488 1.258 62.844 5.398 58.492 C17.186 44.748 24.316 26.835 23.25 8.75 C21.601 8.512 21.601 8.512 19.918 8.27 C11.922 7.035 4.91 5.722 -2.258 1.738 C-8.078 -0.57 -13.108 0.965 -18.75 3.062 Z " fill="#E4E7F1" transform="translate(169.75,13.25)"></path><path d="M0 0 C0.837 -0.002 1.674 -0.004 2.537 -0.006 C6.658 0.089 8.92 0.36 12.465 2.605 C14.957 5.235 15.377 6.25 15.875 9.875 C15.392 14.08 14.824 16.275 11.945 19.355 C8.185 21.353 4.643 21.387 0.438 21.438 C-0.738 21.461 -0.738 21.461 -1.937 21.484 C-7.79 21.327 -10.49 19.887 -14.562 15.688 C-16.041 12.73 -15.998 10.985 -15.562 7.688 C-11.729 0.802 -7.531 -0.367 0 0 Z " fill="#061D83" transform="translate(135.5625,98.3125)"></path><path d="M0 0 C1.622 0.003 1.622 0.003 3.277 0.007 C4.498 0.007 5.719 0.007 6.978 0.007 C8.32 0.012 9.663 0.017 11.005 0.023 C12.372 0.024 13.738 0.026 15.104 0.027 C18.706 0.031 22.308 0.041 25.91 0.052 C29.583 0.062 33.256 0.066 36.929 0.071 C44.141 0.082 51.352 0.099 58.564 0.12 C59.126 2.058 59.126 2.058 59.564 4.12 C58.564 5.12 58.564 5.12 56.128 5.241 C55.046 5.238 53.965 5.236 52.851 5.234 C51.63 5.234 50.408 5.234 49.15 5.234 C47.808 5.228 46.465 5.223 45.123 5.218 C43.756 5.216 42.39 5.215 41.024 5.214 C37.422 5.21 33.82 5.2 30.218 5.189 C26.545 5.179 22.872 5.174 19.199 5.169 C11.987 5.158 4.776 5.141 -2.436 5.12 C-2.999 3.183 -2.999 3.183 -3.436 1.12 C-2.436 0.12 -2.436 0.12 0 0 Z " fill="#0F2587" transform="translate(26.436050415039063,98.87974548339844)"></path><path d="M0 0 C6.287 2.578 12.327 3.931 18.98 5.109 C22 5.688 22 5.688 24 6.688 C24 8.998 24 11.308 24 13.688 C23.67 13.688 23.34 13.688 23 13.688 C23 12.038 23 10.387 23 8.688 C21.351 8.558 21.351 8.558 19.668 8.426 C11.541 7.687 4.723 6.812 -2.508 2.711 C-8.388 0.296 -13.53 1.957 -19.25 4.062 C-26.72 6.713 -34.015 8.688 -42 8.688 C-41.67 13.308 -41.34 17.928 -41 22.688 C-41.66 22.688 -42.32 22.688 -43 22.688 C-43.33 23.347 -43.66 24.008 -44 24.688 C-44.66 18.748 -45.32 12.807 -46 6.688 C-43.154 6.131 -40.308 5.574 -37.375 5 C-29.945 3.498 -23.105 1.514 -16.078 -1.359 C-10.096 -3.212 -5.634 -2.487 0 0 Z " fill="#DEE1EE" transform="translate(170,13.3125)"></path><path d="M0 0 C1.645 0 3.29 0.006 4.935 0.016 C6.232 0.018 6.232 0.018 7.554 0.02 C10.326 0.026 13.097 0.038 15.869 0.051 C17.743 0.056 19.618 0.061 21.492 0.065 C26.097 0.076 30.702 0.093 35.306 0.114 C34.976 1.764 34.646 3.414 34.306 5.114 C21.766 5.114 9.226 5.114 -3.694 5.114 C-4.024 3.794 -4.354 2.474 -4.694 1.114 C-3.694 0.114 -3.694 0.114 0 0 Z " fill="#081F84" transform="translate(27.693603515625,113.886474609375)"></path><path d="M0 0 C2.188 0.342 2.188 0.342 4 1 C3.794 6.67 -0.01 9.638 -3.812 13.375 C-4.442 14.029 -5.072 14.682 -5.721 15.355 C-6.335 15.968 -6.949 16.58 -7.582 17.211 C-8.141 17.771 -8.7 18.331 -9.277 18.908 C-11 20 -11 20 -13.078 19.781 C-15.701 18.715 -17.301 17.169 -19.312 15.188 C-20.031 14.5 -20.749 13.813 -21.488 13.105 C-23 11 -23 11 -22.73 8.738 C-22.369 7.878 -22.369 7.878 -22 7 C-17.564 7.507 -15.373 9.166 -12 12 C-11.18 11.122 -10.36 10.244 -9.516 9.34 C-8.428 8.205 -7.339 7.071 -6.25 5.938 C-5.711 5.357 -5.172 4.776 -4.617 4.178 C-3.016 2.527 -3.016 2.527 0 0 Z " fill="#F3F4F9" transform="translate(170,39)"></path><path d="M0 0 C0.66 0 1.32 0 2 0 C2.77 12.119 0.192 23.205 -4.875 34.125 C-5.202 34.835 -5.53 35.546 -5.867 36.278 C-8.018 40.671 -10.354 43.735 -14 47 C-14 42.93 -12.114 40.131 -10.25 36.625 C-4.146 24.724 -1.39 13.222 0 0 Z " fill="#DCE0EE" transform="translate(194,20)"></path><path d="M0 0 C-0.33 0.99 -0.66 1.98 -1 3 C-2.32 3 -3.64 3 -5 3 C-4.67 7.62 -4.34 12.24 -4 17 C-4.66 17 -5.32 17 -6 17 C-6.33 17.66 -6.66 18.32 -7 19 C-7.66 13.06 -8.32 7.12 -9 1 C-5.804 -0.065 -3.343 -0.074 0 0 Z " fill="#DBDEED" transform="translate(133,19)"></path><path d="M0 0 C0.66 0 1.32 0 2 0 C2.387 1.207 2.773 2.413 3.172 3.656 C3.698 5.271 4.224 6.886 4.75 8.5 C5.003 9.291 5.255 10.083 5.516 10.898 C7.258 16.212 9.39 21.053 12 26 C10.102 25.668 10.102 25.668 8 25 C3.594 17.728 -0.526 8.671 0 0 Z " fill="#D8DCEB" transform="translate(127,36)"></path><path d="M0 0 C0 2.31 0 4.62 0 7 C-0.33 7 -0.66 7 -1 7 C-1 5.35 -1 3.7 -1 2 C-6.61 1.34 -12.22 0.68 -18 0 C-11.591 -3.205 -6.522 -2.13 0 0 Z " fill="#D8DCEC" transform="translate(194,20)"></path><path d="M0 0 C3.659 0.689 7.224 1.568 10.812 2.562 C12.276 2.967 12.276 2.967 13.77 3.379 C14.874 3.686 14.874 3.686 16 4 C14 6 14 6 12.012 6.082 C7.381 5.545 3.747 5.022 0 2 C0 1.34 0 0.68 0 0 Z " fill="#EDEEF6" transform="translate(166,13)"></path><path d="M0 0 C0.66 0 1.32 0 2 0 C2.385 10.832 2.385 10.832 0 16 C-0.66 16.33 -1.32 16.66 -2 17 C-1.34 11.39 -0.68 5.78 0 0 Z " fill="#F8F9FB" transform="translate(194,20)"></path><path d="M0 0 C1.409 2.818 0.509 4.173 -0.438 7.125 C-0.725 8.035 -1.012 8.945 -1.309 9.883 C-1.537 10.581 -1.765 11.28 -2 12 C-2.99 12 -3.98 12 -5 12 C-4.55 10.373 -4.089 8.748 -3.625 7.125 C-3.37 6.22 -3.115 5.315 -2.852 4.383 C-2 2 -2 2 0 0 Z " fill="#D4D8E9" transform="translate(194,35)"></path><path d="M0 0 C6.625 -0.25 6.625 -0.25 10 2 C9.34 2.66 8.68 3.32 8 4 C5.836 3.977 5.836 3.977 3.375 3.625 C2.558 3.514 1.74 3.403 0.898 3.289 C0.272 3.194 -0.355 3.098 -1 3 C-0.67 2.01 -0.34 1.02 0 0 Z " fill="#DCDFED" transform="translate(157,11)"></path><path d="M0 0 C0.33 0 0.66 0 1 0 C1.33 4.62 1.66 9.24 2 14 C1.34 14 0.68 14 0 14 C-0.33 14.66 -0.66 15.32 -1 16 C-1.33 13.36 -1.66 10.72 -2 8 C-1.34 8 -0.68 8 0 8 C0 5.36 0 2.72 0 0 Z " fill="#C5CAE2" transform="translate(127,22)"></path><path d="M0 0 C0.66 0 1.32 0 2 0 C3.423 3.823 4.24 6.913 4 11 C1.966 9.585 1.096 8.45 0.578 6.02 C0.337 4.018 0.165 2.009 0 0 Z " fill="#EAEBF4" transform="translate(127,36)"></path><path d="M0 0 C-2 3 -2 3 -4.164 3.512 C-5.382 3.599 -5.382 3.599 -6.625 3.688 C-7.442 3.753 -8.26 3.819 -9.102 3.887 C-9.728 3.924 -10.355 3.961 -11 4 C-7.642 0.322 -4.884 -0.132 0 0 Z " fill="#E9EBF4" transform="translate(143,17)"></path><path d="M0 0 C1 3 1 3 0.25 5.625 C-1 8 -1 8 -4 9 C-2.25 2.25 -2.25 2.25 0 0 Z " fill="#DCDFED" transform="translate(190,46)"></path><path d="M0 0 C1.98 0.495 1.98 0.495 4 1 C4 3.31 4 5.62 4 8 C3.67 8 3.34 8 3 8 C3 6.35 3 4.7 3 3 C1.68 2.67 0.36 2.34 -1 2 C-0.67 1.34 -0.34 0.68 0 0 Z " fill="#B6BDDB" transform="translate(190,19)"></path><path d="M0 0 C2.622 1.049 3.794 1.649 5.25 4.125 C5.498 4.744 5.745 5.362 6 6 C4.125 5.812 4.125 5.812 2 5 C0.75 2.438 0.75 2.438 0 0 Z " fill="#E8EAF3" transform="translate(137,62)"></path><path d="M0 0 C0.33 0.66 0.66 1.32 1 2 C0.25 4.062 0.25 4.062 -1 6 C-1.99 6.33 -2.98 6.66 -4 7 C-3.398 4.98 -2.727 2.979 -2 1 C-1.34 0.67 -0.68 0.34 0 0 Z " fill="#DEE1EE" transform="translate(187,54)"></path><path d="M0 0 C0.99 0 1.98 0 3 0 C3.66 1.32 4.32 2.64 5 4 C3.062 3.688 3.062 3.688 1 3 C0.67 2.01 0.34 1.02 0 0 Z " fill="#E0E3F0" transform="translate(141,68)"></path><path d="M0 0 C0.33 0.99 0.66 1.98 1 3 C-0.485 3.99 -0.485 3.99 -2 5 C-1.125 1.125 -1.125 1.125 0 0 Z " fill="#E6E9F3" transform="translate(190,46)"></path></svg></div><div class="features-text"><h3></h3><p>Strict quality control standards. Premier quality compounds. </p></div></div>				</div>
				</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-55b7002" data-id="55b7002" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-07faad6 elementor-widget elementor-widget-medibazar-icon-box" data-id="07faad6" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-icon-box.default">
				<div class="elementor-widget-container">
					<div class="features-wrapper"><div class="features-icon fe-1 f-left" style="color:#FEBD00"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 82.88 75.48"><defs><style>.cls-1{fill:none;stroke:#6775b4;stroke-miterlimit:2.61;stroke-width:.5px;}.cls-2{fill:#021981;}.cls-2,.cls-3{stroke-width:0px;}.cls-3{fill:#6775b4;}</style></defs><path class="cls-3" d="m77.71,36.83c0-4.21-.99-8.29-2.95-12.11-1.84-3.58-4.44-6.77-7.73-9.49-.02-.02-.04-.03-.06-.05,2.57,2.4,4.65,5.12,6.18,8.12,1.95,3.8,2.94,7.86,2.94,12.05s-1.08,8.63-3.22,12.58c-1.16,2.14-2.6,4.15-4.29,5.97l2.78,6.42c1.09,2.51.58,5.42-1.29,7.41-1.29,1.38-3.12,2.17-5.01,2.17-.79,0-1.56-.13-2.3-.4-5.2-1.85-11.87-4.17-14.61-5.05-2.83.43-5.08.65-6.7.65-9.01,0-17.54-2.94-24.01-8.28-1.08-.89-2.08-1.83-3.01-2.82,1.29,1.58,2.76,3.06,4.4,4.41,6.5,5.36,15.06,8.31,24.1,8.31,1.62,0,3.87-.22,6.69-.65,2.76.88,9.4,3.19,14.57,5.03.76.27,1.55.41,2.35.41,1.93,0,3.79-.81,5.11-2.22,1.91-2.04,2.42-5.01,1.31-7.57l-2.74-6.33c1.67-1.82,3.1-3.81,4.25-5.94,2.15-3.97,3.24-8.23,3.24-12.65"></path><path class="cls-2" d="m41.44,5.72c8.98,0,17.47,2.93,23.92,8.25,3.26,2.69,5.84,5.85,7.66,9.4,1.94,3.78,2.92,7.81,2.92,11.98s-1.08,8.58-3.2,12.51c-1.17,2.16-2.62,4.17-4.33,6.01l2.82,6.5c1.06,2.46.57,5.31-1.26,7.26-1.29,1.38-3.08,2.13-4.91,2.13-.75,0-1.52-.13-2.25-.39-5.55-1.98-12.05-4.23-14.65-5.06-2.2.34-4.78.66-6.71.66-8.98,0-17.47-2.93-23.92-8.25-3.26-2.69-5.84-5.85-7.66-9.4-1.94-3.78-2.92-7.81-2.92-11.98s.98-8.2,2.92-11.98c1.82-3.55,4.4-6.71,7.66-9.4,6.45-5.32,14.94-8.25,23.92-8.25Zm0-.28c-9.04,0-17.6,2.95-24.1,8.31-3.29,2.71-5.89,5.91-7.73,9.49-1.96,3.82-2.96,7.9-2.96,12.11s.99,8.29,2.96,12.11c1.84,3.58,4.44,6.77,7.73,9.49,6.5,5.36,15.06,8.31,24.1,8.31,1.62,0,3.87-.22,6.69-.65,2.76.88,9.4,3.19,14.57,5.04.76.27,1.55.41,2.35.41,1.93,0,3.79-.81,5.11-2.22,1.91-2.04,2.42-5.01,1.31-7.57l-2.74-6.33c1.67-1.82,3.1-3.81,4.25-5.93,2.15-3.97,3.24-8.23,3.24-12.65s-.99-8.29-2.96-12.11c-1.84-3.58-4.44-6.77-7.73-9.49-6.5-5.36-15.06-8.31-24.1-8.31Z"></path><path class="cls-1" d="m41.44,5.72c8.98,0,17.47,2.93,23.92,8.25,3.26,2.69,5.84,5.85,7.66,9.4,1.94,3.78,2.92,7.81,2.92,11.98s-1.08,8.58-3.2,12.51c-1.17,2.16-2.62,4.17-4.33,6.01l2.82,6.5c1.06,2.46.57,5.31-1.26,7.26-1.29,1.38-3.08,2.13-4.91,2.13-.75,0-1.52-.13-2.25-.39-5.55-1.98-12.05-4.23-14.65-5.06-2.2.34-4.78.66-6.71.66-8.98,0-17.47-2.93-23.92-8.25-3.26-2.69-5.84-5.85-7.66-9.4-1.94-3.78-2.92-7.81-2.92-11.98s.98-8.2,2.92-11.98c1.82-3.55,4.4-6.71,7.66-9.4,6.45-5.32,14.94-8.25,23.92-8.25Zm0-.28c-9.04,0-17.6,2.95-24.1,8.31-3.29,2.71-5.89,5.91-7.73,9.49-1.96,3.82-2.96,7.9-2.96,12.11s.99,8.29,2.96,12.11c1.84,3.58,4.44,6.77,7.73,9.49,6.5,5.36,15.06,8.31,24.1,8.31,1.62,0,3.87-.22,6.69-.65,2.76.88,9.4,3.19,14.57,5.04.76.27,1.55.41,2.35.41,1.93,0,3.79-.81,5.11-2.22,1.91-2.04,2.42-5.01,1.31-7.57l-2.74-6.33c1.67-1.82,3.1-3.81,4.25-5.93,2.15-3.97,3.24-8.23,3.24-12.65s-.99-8.29-2.96-12.11c-1.84-3.58-4.44-6.77-7.73-9.49-6.5-5.36-15.06-8.31-24.1-8.31Z"></path><path class="cls-2" d="m41.44,16.17c6.56,0,12.69,2.08,17.27,5.86,4.37,3.6,6.78,8.33,6.78,13.32,0,2.62-.65,5.15-1.95,7.54-1.28,2.37-3.13,4.49-5.48,6.29l-2.32,1.77,1.16,2.68,1.32,3.05c-8.54-2.96-9.13-2.96-9.71-2.96-.21,0-.43.02-.64.05-2.78.47-5.18.75-6.44.75-6.56,0-12.69-2.08-17.27-5.86-4.37-3.6-6.78-8.33-6.78-13.32s2.41-9.71,6.78-13.32c4.58-3.78,10.71-5.86,17.27-5.86m0-3.73c-15.35,0-27.78,10.26-27.78,22.91s12.44,22.91,27.78,22.91c2.05,0,5.44-.53,7.06-.8,0,0,.01,0,.02,0,.83,0,16.53,5.59,16.53,5.59l-4.72-10.9c5.47-4.18,8.89-10.16,8.89-16.8,0-12.65-12.44-22.91-27.78-22.91Z"></path><path class="cls-2" d="m69.2,36.2c-1.36.95-2.73,1.84-4.12,2.67-.32,1.38-.84,2.72-1.54,4.02-1.28,2.37-3.13,4.49-5.48,6.29l-2.32,1.77,1.16,2.68,1.32,3.05c-8.54-2.96-9.13-2.96-9.71-2.96-.21,0-.43.02-.64.05-2.78.47-5.18.75-6.44.75-6.56,0-12.69-2.08-17.27-5.86-.43-.36-.84-.72-1.23-1.1-2.02-.3-3.98-.71-5.87-1.21,4.72,7.09,13.86,11.9,24.37,11.9,2.05,0,5.44-.53,7.06-.8,0,0,.01,0,.02,0,.83,0,16.53,5.59,16.53,5.59l-4.72-10.9c5.23-4,8.59-9.65,8.87-15.94"></path><path class="cls-3" d="m34.2,34.5c0,2.46-1.99,4.45-4.45,4.45s-4.45-1.99-4.45-4.45,1.99-4.45,4.45-4.45,4.45,1.99,4.45,4.45"></path><path class="cls-3" d="m57.59,34.5c0,2.46-1.99,4.45-4.45,4.45s-4.45-1.99-4.45-4.45,1.99-4.45,4.45-4.45,4.45,1.99,4.45,4.45"></path><path class="cls-3" d="m45.89,34.5c0,2.46-1.99,4.45-4.45,4.45s-4.45-1.99-4.45-4.45,1.99-4.45,4.45-4.45,4.45,1.99,4.45,4.45"></path></svg></div><div class="features-text"><h3></h3><p>Knowledgeable
& Responsive
Customer
Support</p></div></div>				</div>
				</div>
					</div>
		</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-ec0015a elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="ec0015a" data-element_type="section" data-e-type="section">
						<div class="elementor-container elementor-column-gap-no">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-385738f" data-id="385738f" data-element_type="column" data-e-type="column">
			<div class="elementor-widget-wrap elementor-element-populated">
						<div class="elementor-element elementor-element-d95d7d5 elementor-widget elementor-widget-medibazar-product-grid" data-id="d95d7d5" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-product-grid.default">
				<div class="elementor-widget-container">
							
		<div class="product-area klb-product pb-70"><div class="container"><div class="row mb-30"><div class="col-xl-7 col-lg-7 col-md-7"><div class="section-title mb-30"><h2>Featured Ultra-Pure Research Peptides</h2><p></p></div></div><div class="col-xl-5 col-lg-5 col-md-5"><div class="b-button shop-btn s-btn text-md-right mb-30"><a href="https://biogenixpeptides.com/shop/" >View All Products <i class="fal fa-long-arrow-right"></i></a></div></div></div><div class="row"><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/metabolic/5-amino-1mq-50mg-60-capsules/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2025/10/5_amino-50-CAPS-1.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/metabolic/5-amino-1mq-50mg-60-capsules/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=625" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_625" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="625" data-product_sku="AMQ50" aria-label="Add to cart: “5-Amino-1MQ 50mg (60 Capsules)”" rel="nofollow" data-success_message="“5-Amino-1MQ 50mg (60 Capsules)” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>115.00</span>
			</a><a href="625" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/metabolic/5-amino-1mq-50mg-60-capsules/">5-Amino-1MQ 50mg (60 Capsules)</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>115.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/recovery/bpc-157-tb-500-10mg-blend/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/04/BPC-TB-10.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/recovery/bpc-157-tb-500-10mg-blend/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=3465" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_3465" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="3465" data-product_sku="BB10" aria-label="Add to cart: “BPC-157 + TB-500 10mg Blend”" rel="nofollow" data-success_message="“BPC-157 + TB-500 10mg Blend” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>65.00</span>
			</a><a href="3465" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/recovery/bpc-157-tb-500-10mg-blend/">BPC-157 + TB-500 10mg Blend</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>65.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/recovery/cjc-1295-no-dac-ipamorelin/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2025/11/CJC-IPA-3.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/recovery/cjc-1295-no-dac-ipamorelin/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=1303" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_1303" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="1303" data-product_sku="CP10" aria-label="Add to cart: “CJC-1295 no/DAC + Ipamorelin 10mg Blend”" rel="nofollow" data-success_message="“CJC-1295 no/DAC + Ipamorelin 10mg Blend” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>65.00</span>
			</a><a href="1303" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/recovery/cjc-1295-no-dac-ipamorelin/">CJC-1295 no/DAC + Ipamorelin 10mg Blend</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>65.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/recovery/glow-blend/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2025/11/GLOW.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/recovery/glow-blend/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=1323" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_1323" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="1323" data-product_sku="GLW70" aria-label="Add to cart: “GLOW 70mg Blend”" rel="nofollow" data-success_message="“GLOW 70mg Blend” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>160.00</span>
			</a><a href="1323" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/recovery/glow-blend/">GLOW 70mg Blend</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>160.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/metabolic/mots-c-40mg/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2025/11/MOTS-40.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/metabolic/mots-c-40mg/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=1404" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_1404" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="1404" data-product_sku="MS40" aria-label="Add to cart: “MOTS-c 40mg”" rel="nofollow" data-success_message="“MOTS-c 40mg” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>148.00</span>
			</a><a href="1404" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/metabolic/mots-c-40mg/">MOTS-c 40mg</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>148.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/metabolic/retatrutide-glp-3-20mg/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2025/11/RETA-20.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/metabolic/retatrutide-glp-3-20mg/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=1433" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_1433" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="1433" data-product_sku="RT20" aria-label="Add to cart: “Reta (GLP-3) 20mg”" rel="nofollow" data-success_message="“Reta (GLP-3) 20mg” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>195.00</span>
			</a><a href="1433" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/metabolic/retatrutide-glp-3-20mg/">Reta (GLP-3) 20mg</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>195.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/metabolic/semaglutitde-glp-1-20mg/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2025/11/SEMA-20-2.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/metabolic/semaglutitde-glp-1-20mg/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=1443" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_1443" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="1443" data-product_sku="SM20" aria-label="Add to cart: “Sema (GLP-1) 20mg”" rel="nofollow" data-success_message="“Sema (GLP-1) 20mg” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>115.00</span>
			</a><a href="1443" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/metabolic/semaglutitde-glp-1-20mg/">Sema (GLP-1) 20mg</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>115.00</bdi></span></div></div></div><div class="col-lg-3 col-md-6"><div class="product-03-wrapper grey-2-bg pos-rel text-center mb-30"><div class="product-02-img pos-rel"><a href="https://biogenixpeptides.com/shop/performance/tesamorelin-ipamorelin-10mg-blend/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/05/Tesa-Ipa-10.jpg" alt="product_img1"></a><div class="product-action"><a href="https://biogenixpeptides.com/shop/performance/tesamorelin-ipamorelin-10mg-blend/" class="action-btn button learn-more-btn">
		Learn More
	</a><a href="/?add-to-cart=4026" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_4026" data-quantity="1" class="action-btn button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-full" data-product_id="4026" data-product_sku="" aria-label="Add to cart: “Tesamorelin + Ipamorelin 10mg Blend”" rel="nofollow" data-success_message="“Tesamorelin + Ipamorelin 10mg Blend” has been added to your cart" role="button">
				Add to Cart – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>92.00</span>
			</a><a href="4026" class="action-btn button detail-bnt"><i class="far fa-search"></i></a></div></div><div class="product-text"><h4><a href="https://biogenixpeptides.com/shop/performance/tesamorelin-ipamorelin-10mg-blend/">Tesamorelin + Ipamorelin 10mg Blend</a></h4><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>92.00</bdi></span></div></div></div></div></div></div>				</div>
				</div>
				<div class="elementor-element elementor-element-451842e elementor-widget elementor-widget-medibazar-button" data-id="451842e" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-button.default">
				<div class="elementor-widget-container">
					<div class="medibazar-button"><a data-scroll-to class="c-btn button light medium wide medibazar-btn" href="https://biogenixpeptides.com/shop/">View All Products </a></div>				</div>
				</div>
					</div>
		</div>
					</div>
		</section>
		<div class="elementor-element elementor-element-47a687a e-flex e-con-boxed e-con e-parent" data-id="47a687a" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-2c6ff19 elementor-widget elementor-widget-medibazar-latest-blog" data-id="2c6ff19" data-element_type="widget" data-e-type="widget" data-widget_type="medibazar-latest-blog.default">
				<div class="elementor-widget-container">
					<div class="blog-area pt-105 pb-75"><div class="container"><div class="row"><div class="col-xl-6 col-lg-6 offset-lg-3 offset-xl-3"><div class="section-title text-center mb-65"><h2>Latest News & Blog</h2><p>Learning Center</p></div></div></div><div class="row"><div class="col-xl-4 col-lg-4 col-md-6"><div class="blog-wrapper mb-30"><div class="blog-img pos-rel"><a href="https://biogenixpeptides.com/purity-is-only-the-beginning-why-bioavailability-may-be-the-real-standard-in-peptide-quality/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/05/new-4.jpg" alt="blog_small_img1"></a><span class="blog-tag color-1"></span></div><div class="blog-text"><div class="blog-meta"><span><i class="far fa-calendar-alt"></i> <a href="https://biogenixpeptides.com/purity-is-only-the-beginning-why-bioavailability-may-be-the-real-standard-in-peptide-quality/">7 May 2026</a></span></div><h4><a href="https://biogenixpeptides.com/purity-is-only-the-beginning-why-bioavailability-may-be-the-real-standard-in-peptide-quality/">Purity Is Only the Beginning: Why Bioavailability May Be the Real Standard in Peptide Quality</a></h4><p>Research Disclaimer: This article is for educational and research discussion only. BioGenix Peptides products are intended strictly for laboratory research </p><div class="b-button gray-b-button"><a href="https://biogenixpeptides.com/purity-is-only-the-beginning-why-bioavailability-may-be-the-real-standard-in-peptide-quality/">read more <i class="far fa-plus"></i></a></div></div></div></div><div class="col-xl-4 col-lg-4 col-md-6"><div class="blog-wrapper mb-30"><div class="blog-img pos-rel"><a href="https://biogenixpeptides.com/fast-peptide-shipping-usa-a-guide-to-ground-and-express-delivery/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/05/fast-peptide-shipping-usa-a-guide-to-ground-and-express-delivery-image.jpg" alt="blog_small_img1"></a><span class="blog-tag color-1">Buying Guide</span></div><div class="blog-text"><div class="blog-meta"><span><i class="far fa-calendar-alt"></i> <a href="https://biogenixpeptides.com/fast-peptide-shipping-usa-a-guide-to-ground-and-express-delivery/">6 May 2026</a></span></div><h4><a href="https://biogenixpeptides.com/fast-peptide-shipping-usa-a-guide-to-ground-and-express-delivery/">Fast Peptide Shipping USA: A Guide to Ground and Express Delivery</a></h4><p>Discover fast peptide shipping USA: expert tips on compliance, stability packaging, expedited carriers & free shipping thresholds for research peptides. </p><div class="b-button gray-b-button"><a href="https://biogenixpeptides.com/fast-peptide-shipping-usa-a-guide-to-ground-and-express-delivery/">read more <i class="far fa-plus"></i></a></div></div></div></div><div class="col-xl-4 col-lg-4 col-md-6"><div class="blog-wrapper mb-30"><div class="blog-img pos-rel"><a href="https://biogenixpeptides.com/the-complete-guide-to-peptide-blends/"><img decoding="async" src="https://biogenixpeptides.com/wp-content/uploads/2026/05/the-complete-guide-to-peptide-blends-image.jpg" alt="blog_small_img1"></a><span class="blog-tag color-1">Peptide Basics</span></div><div class="blog-text"><div class="blog-meta"><span><i class="far fa-calendar-alt"></i> <a href="https://biogenixpeptides.com/the-complete-guide-to-peptide-blends/">5 May 2026</a></span></div><h4><a href="https://biogenixpeptides.com/the-complete-guide-to-peptide-blends/">The Complete Guide to Peptide Blends</a></h4><p>Master peptide blends research. Explore synergistic effects, popular combinations, quality control, and safety for scientific studies. </p><div class="b-button gray-b-button"><a href="https://biogenixpeptides.com/the-complete-guide-to-peptide-blends/">read more <i class="far fa-plus"></i></a></div></div></div></div><div class="col-12"></div></div></div></div>				</div>
				</div>
					</div>
				</div>
				</div>
												
					
									</main>
			<footer>
								<div class="footer-area pt-80 pb-45">
					<div class="container">
						<div class="row">
															<div class="col-xl-3 col-lg-3 col-md-6">
									<div class="klbfooterwidget footer-wrapper mb-30 widget_footer_about"><h3 class="footer-title">About Us</h3>		
		
		
		<div class="footer-text">
			<p>Our mission is to advance the frontiers of scientific discovery through compounds that embody precision, purity, and trust at every level. </p>
		</div>
						<div class="footer-icon">
						<a href="https://www.facebook.com/biogenixpeptidesresearch/" target="_blank"><i class="fab fa-facebook-f"></i></a>
						<a href="https://www.instagram.com/biogenixpeptides/" target="_blank"><i class="fab fa-instagram"></i></a>
					</div>
			



		</div>								</div>
								<div class="col-xl-3 col-lg-3 col-md-6">
									<div class="klbfooterwidget footer-wrapper ml-50 mb-30 widget_nav_menu"><h3 class="footer-title">Shop</h3><div class="menu-footer-menu-1-container"><ul id="menu-footer-menu-1" class="menu"><li id="menu-item-864" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-864"><a href="https://biogenixpeptides.com/shop/">Shop All</a></li>
<li id="menu-item-865" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-865"><a href="https://biogenixpeptides.com/best-sellers/">Best Sellers</a></li>
<li id="menu-item-866" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-866"><a href="https://biogenixpeptides.com/?page_id=841">Synergy Series</a></li>
</ul></div></div>								</div>
								<div class="col-xl-2 col-lg-3 col-md-6">
									<div class="klbfooterwidget footer-wrapper ml-30 mb-30 widget_nav_menu"><h3 class="footer-title">Learn More</h3><div class="menu-footer-menu-2-container"><ul id="menu-footer-menu-2" class="menu"><li id="menu-item-462" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-462"><a href="https://biogenixpeptides.com/about/">About Us</a></li>
<li id="menu-item-862" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-862"><a href="https://biogenixpeptides.com/blog/">Research Library</a></li>
<li id="menu-item-907" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-907"><a href="/privacy-policy">Privacy Policy</a></li>
<li id="menu-item-908" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-908"><a href="/terms-and-conditions">Terms and Conditions</a></li>
<li id="menu-item-909" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-909"><a href="/refund-policy">Refund Policy</a></li>
</ul></div></div>								</div>
								<div class="col-xl-2 col-lg-3 col-md-6">
									<div class="klbfooterwidget footer-wrapper ml-20 mb-30 widget_media_image"><h3 class="footer-title">Now Accepting</h3><img width="2560" height="903" src="https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-scaled.jpg" class="image wp-image-3714  attachment-full size-full" alt="" style="max-width: 100%; height: auto;" title="Now Accepting" decoding="async" srcset="https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-scaled.jpg 2560w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-300x106.jpg 300w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-1024x361.jpg 1024w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-768x271.jpg 768w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-1536x542.jpg 1536w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-2048x723.jpg 2048w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-600x212.jpg 600w, https://biogenixpeptides.com/wp-content/uploads/2026/04/bgx-2-90x32.jpg 90w" sizes="(max-width: 2560px) 100vw, 2560px" /></div>								</div>
								<div class="col-xl-2 col-lg-3 col-md-6">
									<div class="klbfooterwidget footer-wrapper ml-20 mb-30 widget_text">			<div class="textwidget"><p>BioGenix Peptides sells products strictly for research, laboratory, and analytical use. These products are not for human or animal consumption. BioGenix Peptides is a chemical supplier and is not a compounding pharmacy or a chemical compounding facility under section 503A of the Federal Food, Drug, and Cosmetic Act. BioGenix Peptides is also not an outsourcing facility under section 503B. The statements on this website have not been evaluated by the US Food and Drug Administration. Nothing offered by BioGenix Peptides is intended to diagnose, treat, cure, or prevent any disease.</p>
</div>
		</div>								</div>
													</div>
					</div>
				</div>
								
				<div class="footer-bottom-area mr-70 ml-70 pt-25 pb-25">
					<div class="container">
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-6">
								<div class="copyright">
																			<p>Copyright 2026. BioGenix Peptides</p>
																	</div>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-6">
								<div class="footer-bottom-link f-right">
																																													</div>
							</div>
						</div>
					</div>
				</div>
			</footer>

									
	
	<script type="speculationrules">
{"prefetch":[{"source":"document","where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":["/wp-*.php","/wp-admin/*","/wp-content/uploads/*","/wp-content/*","/wp-content/plugins/*","/wp-content/themes/medibazar-child/*","/wp-content/themes/medibazar/*","/*\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\"nofollow\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}
</script>

<div id="cartbounty-pro-exit-intent-form" class="cartbounty-pro-ei-center email">
	<div id="cartbounty-pro-exit-intent-form-container" style="background-color:#e3e3e3">
		<div id="cartbounty-pro-exit-intent-close">
			<svg><line x1="1" y1="11" x2="11" y2="1" stroke="#1c1c1c" stroke-width="2"/><line x1="1" y1="1" x2="11" y2="11" stroke="#1c1c1c" stroke-width="2"/></svg>		</div>
		<div id="cartbounty-pro-exit-intent-form-content">
						<div id="cartbounty-pro-exit-intent-form-content-l">
				<img src="https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro//public/assets/abandoned-shopping-cart.gif" title="You were not leaving your cart just like that, right?" alt="You were not leaving your cart just like that, right?" />			</div>
			<div id="cartbounty-pro-exit-intent-form-content-r">
				<h2 style="color: #1c1c1c">Your Cart Is Still Saved &#x1f440;</h2>								<p style="color: #1c1c1c">Don’t lose your saved cart.

Enter your email below so your research items are ready whenever you return.</p>				<form>
										<input type="email" id="cartbounty-pro-exit-intent-email" required placeholder="Enter your email">					
					<button type="submit" name="cartbounty-pro-exit-intent-submit" id="cartbounty-pro-exit-intent-submit" class="button" value="submit" style="background-color: #1c1c1c;color: #e3e3e3">Save</button>									</form>
			</div>
					</div>
	</div>
	<div id="cartbounty-pro-exit-intent-form-backdrop" style="background-color:#1c1c1c; opacity: 0;"></div>
</div><script>localStorage.setItem( 'cartbounty_pro_product_count', 0 )</script>
<!-- Consent Management powered by Complianz | GDPR/CCPA Cookie Consent https://wordpress.org/plugins/complianz-gdpr -->
<div id="cmplz-cookiebanner-container"><div class="cmplz-cookiebanner cmplz-hidden banner-1 banner-a optout cmplz-bottom-left cmplz-categories-type-view-preferences" aria-modal="true" data-nosnippet="true" role="dialog" aria-live="polite" aria-labelledby="cmplz-header-1-optout" aria-describedby="cmplz-message-1-optout">
	<div class="cmplz-header">
		<div class="cmplz-logo"></div>
		<div class="cmplz-title" id="cmplz-header-1-optout">Manage Consent</div>
		<div class="cmplz-close" tabindex="0" role="button" aria-label="Close dialog">
			<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
		</div>
	</div>

	<div class="cmplz-divider cmplz-divider-header"></div>
	<div class="cmplz-body">
		<div class="cmplz-message" id="cmplz-message-1-optout">To provide the best experiences, we use technologies like cookies to store and/or access device information. Consenting to these technologies will allow us to process data such as browsing behavior or unique IDs on this site. Not consenting or withdrawing consent, may adversely affect certain features and functions.</div>
		<!-- categories start -->
		<div class="cmplz-categories">
			<details class="cmplz-category cmplz-functional" >
				<summary>
						<span class="cmplz-category-header">
							<span class="cmplz-category-title">Functional</span>
							<span class='cmplz-always-active'>
								<span class="cmplz-banner-checkbox">
									<input type="checkbox"
										   id="cmplz-functional-optout"
										   data-category="cmplz_functional"
										   class="cmplz-consent-checkbox cmplz-functional"
										   size="40"
										   value="1"/>
									<label class="cmplz-label" for="cmplz-functional-optout"><span class="screen-reader-text">Functional</span></label>
								</span>
								Always active							</span>
							<span class="cmplz-icon cmplz-open">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"  height="18" ><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
							</span>
						</span>
				</summary>
				<div class="cmplz-description">
					<span class="cmplz-description-functional">The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network.</span>
				</div>
			</details>

			<details class="cmplz-category cmplz-preferences" >
				<summary>
						<span class="cmplz-category-header">
							<span class="cmplz-category-title">Preferences</span>
							<span class="cmplz-banner-checkbox">
								<input type="checkbox"
									   id="cmplz-preferences-optout"
									   data-category="cmplz_preferences"
									   class="cmplz-consent-checkbox cmplz-preferences"
									   size="40"
									   value="1"/>
								<label class="cmplz-label" for="cmplz-preferences-optout"><span class="screen-reader-text">Preferences</span></label>
							</span>
							<span class="cmplz-icon cmplz-open">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"  height="18" ><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
							</span>
						</span>
				</summary>
				<div class="cmplz-description">
					<span class="cmplz-description-preferences">The technical storage or access is necessary for the legitimate purpose of storing preferences that are not requested by the subscriber or user.</span>
				</div>
			</details>

			<details class="cmplz-category cmplz-statistics" >
				<summary>
						<span class="cmplz-category-header">
							<span class="cmplz-category-title">Statistics</span>
							<span class="cmplz-banner-checkbox">
								<input type="checkbox"
									   id="cmplz-statistics-optout"
									   data-category="cmplz_statistics"
									   class="cmplz-consent-checkbox cmplz-statistics"
									   size="40"
									   value="1"/>
								<label class="cmplz-label" for="cmplz-statistics-optout"><span class="screen-reader-text">Statistics</span></label>
							</span>
							<span class="cmplz-icon cmplz-open">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"  height="18" ><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
							</span>
						</span>
				</summary>
				<div class="cmplz-description">
					<span class="cmplz-description-statistics">The technical storage or access that is used exclusively for statistical purposes.</span>
					<span class="cmplz-description-statistics-anonymous">The technical storage or access that is used exclusively for anonymous statistical purposes. Without a subpoena, voluntary compliance on the part of your Internet Service Provider, or additional records from a third party, information stored or retrieved for this purpose alone cannot usually be used to identify you.</span>
				</div>
			</details>
			<details class="cmplz-category cmplz-marketing" >
				<summary>
						<span class="cmplz-category-header">
							<span class="cmplz-category-title">Marketing</span>
							<span class="cmplz-banner-checkbox">
								<input type="checkbox"
									   id="cmplz-marketing-optout"
									   data-category="cmplz_marketing"
									   class="cmplz-consent-checkbox cmplz-marketing"
									   size="40"
									   value="1"/>
								<label class="cmplz-label" for="cmplz-marketing-optout"><span class="screen-reader-text">Marketing</span></label>
							</span>
							<span class="cmplz-icon cmplz-open">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"  height="18" ><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
							</span>
						</span>
				</summary>
				<div class="cmplz-description">
					<span class="cmplz-description-marketing">The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes.</span>
				</div>
			</details>
		</div><!-- categories end -->
			</div>

	<div class="cmplz-links cmplz-information">
		<ul>
			<li><a class="cmplz-link cmplz-manage-options cookie-statement" href="#" data-relative_url="#cmplz-manage-consent-container">Manage options</a></li>
			<li><a class="cmplz-link cmplz-manage-third-parties cookie-statement" href="#" data-relative_url="#cmplz-cookies-overview">Manage services</a></li>
			<li><a class="cmplz-link cmplz-manage-vendors tcf cookie-statement" href="#" data-relative_url="#cmplz-tcf-wrapper">Manage {vendor_count} vendors</a></li>
			<li><a class="cmplz-link cmplz-external cmplz-read-more-purposes tcf" target="_blank" rel="noopener noreferrer nofollow" href="https://cookiedatabase.org/tcf/purposes/" aria-label="Read more about TCF purposes on Cookie Database">Read more about these purposes</a></li>
		</ul>
			</div>

	<div class="cmplz-divider cmplz-footer"></div>

	<div class="cmplz-buttons">
		<button class="cmplz-btn cmplz-accept">Accept</button>
		<button class="cmplz-btn cmplz-deny">Deny</button>
		<button class="cmplz-btn cmplz-view-preferences">View preferences</button>
		<button class="cmplz-btn cmplz-save-preferences">Save preferences</button>
		<a class="cmplz-btn cmplz-manage-options tcf cookie-statement" href="#" data-relative_url="#cmplz-manage-consent-container">View preferences</a>
			</div>

	
	<div class="cmplz-documents cmplz-links">
		<ul>
			<li><a class="cmplz-link cookie-statement" href="#" data-relative_url="">{title}</a></li>
			<li><a class="cmplz-link privacy-statement" href="#" data-relative_url="">{title}</a></li>
			<li><a class="cmplz-link impressum" href="#" data-relative_url="">{title}</a></li>
		</ul>
			</div>
</div>
</div>
					<div id="cmplz-manage-consent" data-nosnippet="true"><button class="cmplz-btn cmplz-hidden cmplz-manage-consent manage-consent-1">Manage consent</button>

</div><script id='kirki-viewport-lists'>var kirkiViewports = {"md":{"value":1200,"scale":1,"minWidth":1200,"maxWidth":1200,"title":"Desktop","icon":"desktop","activeIcon":"desktop-hover","id":"md","type":"max"},"tablet":{"value":991,"scale":1,"minWidth":991,"maxWidth":991,"title":"Tablet","icon":"tablet-default","activeIcon":"tablet-hover","type":"max","id":"tablet"},"mobileLandscape":{"value":767,"scale":1,"minWidth":767,"maxWidth":767,"title":"Landscape","icon":"phone-hr-default","activeIcon":"phone-hr-hover","type":"max","id":"mobileLandscape"},"mobile":{"value":575,"scale":1,"minWidth":575,"maxWidth":575,"title":"Mobile","icon":"phone-vr-default","activeIcon":"phone-vr-hover","type":"max","id":"mobile"}};</script><script id='kirki-variable-lists'>var kirkiCSSVariable = {"data":[{"title":"Colors","key":"color","modes":[{"title":"Default","key":"default"}],"variables":[]},{"title":"Numbers","key":"size","modes":[{"title":"Default","key":"default"}],"variables":[]},{"title":"Font Family","key":"font-family","modes":[{"title":"Default","key":"default"}],"variables":[]},{"title":"Text Styles","key":"text-style","modes":[{"title":"Default","key":"default"}],"variables":[]}]};</script><script id="kirki-api-and-nonce">
    window.wp_kirki = {
        ajaxUrl: "https://biogenixpeptides.com/wp-admin/admin-ajax.php",
        restUrl: "https://biogenixpeptides.com/wp-json/",
        siteUrl: "https://biogenixpeptides.com",
        apiVersion: "v1",
        postId: "21",
        nonce: "8c2ad68b47",
        call_from: "",
        templateId: "",
        context: {"id":21,"type":"post"}
    };
    </script><style>
.sh-minimum-wrapper {
    margin: 20px 0;
}

.sh-minimum-message {
    margin-bottom: 8px;
    font-weight: 600;
}

.sh-progress-bar {
    background: #eee;
    height: 10px;
    border-radius: 20px;
    overflow: hidden;
}

.sh-progress-fill {
    background: #2e7d32;
    height: 100%;
    width: 0;
    transition: width 0.4s ease;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function() {

    function updateMinimumProgress() {

        var wrapper = document.querySelector(".sh-minimum-wrapper");
        if (!wrapper) return;

        var minimum = parseFloat(wrapper.dataset.minimum);

        var subtotalEl = document.querySelector(".cart-subtotal .amount");
        if (!subtotalEl) return;

        var current = parseFloat(subtotalEl.textContent.replace(/[^0-9.]/g, ''));

        var remaining = Math.max(0, minimum - current);
        var percentage = Math.min(100, (current / minimum) * 100);

        var messageEl = wrapper.querySelector(".sh-minimum-message");
        var fillEl = wrapper.querySelector(".sh-progress-fill");

        if (current < minimum) {
            messageEl.innerHTML = "<strong>You're $" + remaining.toFixed(2) + " away from checkout.</strong>";
        } else {
            messageEl.innerHTML = "<strong>Minimum reached. You're ready to checkout.</strong>";
        }

        fillEl.style.width = percentage + "%";
    }

    document.body.addEventListener("updated_cart_totals", updateMinimumProgress);
    document.body.addEventListener("updated_checkout", updateMinimumProgress);

    updateMinimumProgress();
});
</script>
		<div data-elementor-type="popup" data-elementor-id="2679" class="elementor elementor-2679 elementor-location-popup" data-elementor-settings="{&quot;entrance_animation&quot;:&quot;slideInRight&quot;,&quot;exit_animation&quot;:&quot;slideInRight&quot;,&quot;entrance_animation_duration&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;1&quot;,&quot;sizes&quot;:[]},&quot;prevent_close_on_background_click&quot;:&quot;yes&quot;,&quot;prevent_close_on_esc_key&quot;:&quot;yes&quot;,&quot;a11y_navigation&quot;:&quot;yes&quot;,&quot;triggers&quot;:{&quot;page_load_delay&quot;:3,&quot;page_load&quot;:&quot;yes&quot;},&quot;timing&quot;:{&quot;times_times&quot;:1,&quot;times_period&quot;:&quot;session&quot;,&quot;times&quot;:&quot;yes&quot;}}" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-5ac562dd e-con-full e-flex e-con e-parent" data-id="5ac562dd" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-585efb36 elementor-widget elementor-widget-image" data-id="585efb36" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img width="2560" height="1380" src="https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-scaled.jpg" class="attachment-full size-full wp-image-3853" alt="" srcset="https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-scaled.jpg 2560w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-300x162.jpg 300w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-1024x552.jpg 1024w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-768x414.jpg 768w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-1536x828.jpg 1536w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-2048x1104.jpg 2048w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-600x324.jpg 600w, https://biogenixpeptides.com/wp-content/uploads/2026/01/coupon-code-1-90x49.jpg 90w" sizes="(max-width: 2560px) 100vw, 2560px" />															</div>
		<div class="elementor-element elementor-element-61c49c36 e-flex e-con-boxed e-con e-child" data-id="61c49c36" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-1d73f306 elementor-widget elementor-widget-heading" data-id="1d73f306" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">lIMITED tIME rESEARCH aCCESS!</h6>				</div>
				<div class="elementor-element elementor-element-317e8ad7 elementor-widget elementor-widget-heading" data-id="317e8ad7" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h3 class="elementor-heading-title elementor-size-default">15% Off</h3>				</div>
				<div class="elementor-element elementor-element-613c14c8 elementor-widget elementor-widget-text-editor" data-id="613c14c8" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<ul><li><h3>Use Code: <strong>BGX15</strong></h3></li></ul>								</div>
				<div class="elementor-element elementor-element-67de4e7c elementor-align-center elementor-widget__width-inherit elementor-widget elementor-widget-button" data-id="67de4e7c" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="https://biogenixpeptides.com/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">ENTER SITE NOW</span>
					</span>
					</a>
								</div>
					</div>
				</div>
				</div>
				</div>
		        <script>
          const credit_card_el = document.querySelector('.wc_payment_method.payment_method_ipospays');
          if (credit_card_el) credit_card_el.style.display = "block";
        </script>
                <script>
          const credit_card_el = document.querySelector('.wc_payment_method.payment_method_ipospays');
          if (credit_card_el) credit_card_el.style.display = "block";
        </script>
        <div id='pys_ajax_events'></div>        <script>
            var node = document.getElementsByClassName('woocommerce-message')[0];
            if(node && document.getElementById('pys_late_event')) {
                var messageText = node.textContent.trim();
                if(!messageText) {
                    node.style.display = 'none';
                }
            }
        </script>
        <!-- Instagram Feed JS -->
<script type="text/javascript">
var sbiajaxurl = "https://biogenixpeptides.com/wp-admin/admin-ajax.php";
</script>
			<script>
				const lazyloadRunObserver = () => {
					const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );
					const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {
						entries.forEach( ( entry ) => {
							if ( entry.isIntersecting ) {
								let lazyloadBackground = entry.target;
								if( lazyloadBackground ) {
									lazyloadBackground.classList.add( 'e-lazyloaded' );
								}
								lazyloadBackgroundObserver.unobserve( entry.target );
							}
						});
					}, { rootMargin: '200px 0px 200px 0px' } );
					lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {
						lazyloadBackgroundObserver.observe( lazyloadBackground );
					} );
				};
				const events = [
					'DOMContentLoaded',
					'elementor/lazyload/observe',
				];
				events.forEach( ( event ) => {
					document.addEventListener( event, lazyloadRunObserver );
				} );
			</script>
			<noscript><img height="1" width="1" style="display: none;" src="https://www.facebook.com/tr?id=1219726330086095&ev=PageView&noscript=1&cd%5Bpage_title%5D=Biogenix+Peptides&cd%5Bpost_type%5D=page&cd%5Bpost_id%5D=21&cd%5Bplugin%5D=PixelYourSite&cd%5Buser_role%5D=guest&cd%5Bevent_url%5D=biogenixpeptides.com%2F" alt=""></noscript>
	<script type='text/javascript'>
		(function () {
			var c = document.body.className;
			c = c.replace(/woocommerce-no-js/, 'woocommerce-js');
			document.body.className = c;
		})();
	</script>
	<link rel='stylesheet' id='ipospays-blocks-style-css' href='https://biogenixpeptides.com/wp-content/plugins/ipospays-gateways-wc/blocks/../assets/css/style.css?ver=1.3.7' type='text/css' media='all' />
<link rel='stylesheet' id='wc-blocks-style-css' href='https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/client/blocks/wc-blocks.css?ver=wc-10.7.0' type='text/css' media='all' />
<script type="text/javascript" src="https://biogenixpeptides.com/wp-includes/js/dist/hooks.min.js?ver=dd5603f07f9220ed27f1" id="wp-hooks-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-includes/js/dist/i18n.min.js?ver=c26c3dc7bed366793375" id="wp-i18n-js"></script>
<script type="text/javascript" id="wp-i18n-js-after">
/* <![CDATA[ */
wp.i18n.setLocaleData( { 'text direction\u0004ltr': [ 'ltr' ] } );
//# sourceURL=wp-i18n-js-after
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/contact-form-7/includes/swv/js/index.js?ver=6.1.5" id="swv-js"></script>
<script type="text/javascript" id="contact-form-7-js-before">
/* <![CDATA[ */
var wpcf7 = {
    "api": {
        "root": "https:\/\/biogenixpeptides.com\/wp-json\/",
        "namespace": "contact-form-7\/v1"
    },
    "cached": 1
};
//# sourceURL=contact-form-7-js-before
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/contact-form-7/includes/js/index.js?ver=6.1.5" id="contact-form-7-js"></script>
<script type="text/javascript" id="cartbounty-pro-tab-notification-js-extra">
/* <![CDATA[ */
var cartbounty_tn = {"product_count":"0","message":"Your research cart is waiting","check_cart":"1","interval":"2000","favicon_enabled":"","favicon":"https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro//public/assets/tab-notification-favicon.png","favicon_relationship":"icon, shortcut icon"};
//# sourceURL=cartbounty-pro-tab-notification-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woo-save-abandoned-carts-pro/public/js/cartbounty-pro-tab-notification.js?ver=11.0.1" id="cartbounty-pro-tab-notification-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-includes/js/comment-reply.min.js?ver=6.9.4" id="comment-reply-js" async="async" data-wp-strategy="async" fetchpriority="low"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//vendor/modernizr-3.5.0.min.js?ver=1.0" id="modernizr-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//popper.min.js?ver=1.0" id="popper-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//bootstrap.min.js?ver=1.0" id="bootstrap-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//owl.carousel.min.js?ver=1.0" id="owl-carousel-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//isotope.pkgd.min.js?ver=1.0" id="isotope-pkgd-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//slick.min.js?ver=1.0" id="slick-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.meanmenu.min.js?ver=1.0" id="jquery-meanmenu-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//wow.min.js?ver=1.0" id="wow-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//waypoints.min.js?ver=1.0" id="waypoints-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.appear.js?ver=1.0" id="jquery-appear-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.countdown.min.js?ver=1.0" id="jquery-countdown-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.knob.js?ver=1.0" id="jquery-knob-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.counterup.min.js?ver=1.0" id="jquery-counterup-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.scrollUp.min.js?ver=1.0" id="jquery-scrollup-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//jquery.magnific-popup.min.js?ver=1.0" id="jquery-magnific-popup-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//plugins.js?ver=1.0" id="medibazar-plugins-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js//main.js?ver=1.0" id="medibazar-scripts-js"></script>
<script type="text/javascript" id="medibazar-quick-ajax-js-extra">
/* <![CDATA[ */
var MyAjax = {"ajaxurl":"https://biogenixpeptides.com/wp-admin/admin-ajax.php"};
//# sourceURL=medibazar-quick-ajax-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/themes/medibazar/assets/js/custom/quick_ajax.js?ver=1.0.0" id="medibazar-quick-ajax-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=4.0.7" id="elementor-webpack-runtime-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=4.0.7" id="elementor-frontend-modules-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-includes/js/jquery/ui/core.min.js?ver=1.13.3" id="jquery-ui-core-js"></script>
<script type="text/javascript" id="elementor-frontend-js-before">
/* <![CDATA[ */
var elementorFrontendConfig = {"environmentMode":{"edit":false,"wpPreview":false,"isScriptDebug":false},"i18n":{"shareOnFacebook":"Share on Facebook","shareOnTwitter":"Share on Twitter","pinIt":"Pin it","download":"Download","downloadImage":"Download image","fullscreen":"Fullscreen","zoom":"Zoom","share":"Share","playVideo":"Play Video","previous":"Previous","next":"Next","close":"Close","a11yCarouselPrevSlideMessage":"Previous slide","a11yCarouselNextSlideMessage":"Next slide","a11yCarouselFirstSlideMessage":"This is the first slide","a11yCarouselLastSlideMessage":"This is the last slide","a11yCarouselPaginationBulletMessage":"Go to slide"},"is_rtl":false,"breakpoints":{"xs":0,"sm":480,"md":768,"lg":1025,"xl":1440,"xxl":1600},"responsive":{"breakpoints":{"mobile":{"label":"Mobile Portrait","value":767,"default_value":767,"direction":"max","is_enabled":true},"mobile_extra":{"label":"Mobile Landscape","value":880,"default_value":880,"direction":"max","is_enabled":false},"tablet":{"label":"Tablet Portrait","value":1024,"default_value":1024,"direction":"max","is_enabled":true},"tablet_extra":{"label":"Tablet Landscape","value":1200,"default_value":1200,"direction":"max","is_enabled":false},"laptop":{"label":"Laptop","value":1366,"default_value":1366,"direction":"max","is_enabled":false},"widescreen":{"label":"Widescreen","value":2400,"default_value":2400,"direction":"min","is_enabled":false}},"hasCustomBreakpoints":false},"version":"4.0.7","is_static":false,"experimentalFeatures":{"e_font_icon_svg":true,"additional_custom_breakpoints":true,"container":true,"e_optimized_markup":true,"theme_builder_v2":true,"e_pro_free_trial_popup":true,"nested-elements":true,"global_classes_should_enforce_capabilities":true,"e_variables":true,"e_opt_in_v4_page":true,"e_components":true,"e_interactions":true,"e_widget_creation":true,"import-export-customization":true,"e_pro_atomic_form":true,"mega-menu":true,"e_pro_variables":true,"e_pro_interactions":true},"urls":{"assets":"https:\/\/biogenixpeptides.com\/wp-content\/plugins\/elementor\/assets\/","ajaxurl":"https:\/\/biogenixpeptides.com\/wp-admin\/admin-ajax.php","uploadUrl":"https:\/\/biogenixpeptides.com\/wp-content\/uploads"},"nonces":{"floatingButtonsClickTracking":"d2527c3218","atomicFormsSendForm":"8b77bcd24b"},"swiperClass":"swiper","settings":{"page":[],"editorPreferences":[]},"kit":{"active_breakpoints":["viewport_mobile","viewport_tablet"],"global_image_lightbox":"yes","lightbox_enable_counter":"yes","lightbox_enable_fullscreen":"yes","lightbox_enable_zoom":"yes","lightbox_enable_share":"yes","lightbox_title_src":"title","lightbox_description_src":"description","woocommerce_notices_elements":[]},"post":{"id":21,"title":"Research%20Grade%20Peptides%20%7C%20Ultra-Pure%20Peptide%20Supplier%20%E2%80%93%20BioGenix","excerpt":"","featuredImage":false}};
//# sourceURL=elementor-frontend-js-before
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=4.0.7" id="elementor-frontend-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js?ver=10.7.0" id="sourcebuster-js-js"></script>
<script type="text/javascript" id="wc-order-attribution-js-extra">
/* <![CDATA[ */
var wc_order_attribution = {"params":{"lifetime":1.0e-5,"session":30,"base64":false,"ajaxurl":"https://biogenixpeptides.com/wp-admin/admin-ajax.php","prefix":"wc_order_attribution_","allowTracking":true},"fields":{"source_type":"current.typ","referrer":"current_add.rf","utm_campaign":"current.cmp","utm_source":"current.src","utm_medium":"current.mdm","utm_content":"current.cnt","utm_id":"current.id","utm_term":"current.trm","utm_source_platform":"current.plt","utm_creative_format":"current.fmt","utm_marketing_tactic":"current.tct","session_entry":"current_add.ep","session_start_time":"current_add.fd","session_pages":"session.pgs","session_count":"udata.vst","user_agent":"udata.uag"}};
//# sourceURL=wc-order-attribution-js-extra
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/woocommerce/assets/js/frontend/order-attribution.min.js?ver=10.7.0" id="wc-order-attribution-js"></script>
<script data-service="facebook" data-category="marketing" type="text/plain" defer data-cmplz-src="https://biogenixpeptides.com/wp-content/plugins/pixelyoursite/dist/scripts/jquery.bind-first-0.2.3.min.js?ver=0.2.3" id="jquery-bind-first-js"></script>
<script data-service="facebook" data-category="marketing" type="text/plain" defer data-cmplz-src="https://biogenixpeptides.com/wp-content/plugins/pixelyoursite/dist/scripts/js.cookie-2.1.3.min.js?ver=2.1.3" id="js-cookie-pys-js"></script>
<script data-service="facebook" data-category="marketing" type="text/plain" defer data-cmplz-src="https://biogenixpeptides.com/wp-content/plugins/pixelyoursite/dist/scripts/tld.min.js?ver=2.3.1" id="js-tld-js"></script>
<script data-service="facebook" data-category="marketing" type="text/plain" id="pys-js-extra">
/* <![CDATA[ */
var pysOptions = {"staticEvents":{"facebook":{"init_event":[{"delay":0,"type":"static","ajaxFire":false,"name":"PageView","pixelIds":["1219726330086095"],"eventID":"a15bd882-55e5-47b2-9035-b9d33e559ebd","params":{"page_title":"Biogenix Peptides","post_type":"page","post_id":21,"plugin":"PixelYourSite","user_role":"guest","event_url":"biogenixpeptides.com/"},"e_id":"init_event","ids":[],"hasTimeWindow":false,"timeWindow":0,"woo_order":"","edd_order":""}]}},"dynamicEvents":[],"triggerEvents":[],"triggerEventTypes":[],"facebook":{"pixelIds":["1219726330086095"],"advancedMatching":[],"advancedMatchingEnabled":false,"removeMetadata":true,"wooVariableAsSimple":false,"serverApiEnabled":false,"wooCRSendFromServer":false,"send_external_id":null,"enabled_medical":false,"do_not_track_medical_param":["event_url","post_title","page_title","landing_page","content_name","categories","category_name","tags"],"meta_ldu":false},"debug":"","siteUrl":"https://biogenixpeptides.com","ajaxUrl":"https://biogenixpeptides.com/wp-admin/admin-ajax.php","ajax_event":"e42695adb9","enable_remove_download_url_param":"1","cookie_duration":"7","last_visit_duration":"60","enable_success_send_form":"","ajaxForServerEvent":"1","ajaxForServerStaticEvent":"1","useSendBeacon":"1","send_external_id":"1","external_id_expire":"180","track_cookie_for_subdomains":"1","google_consent_mode":"1","gdpr":{"ajax_enabled":false,"all_disabled_by_api":false,"facebook_disabled_by_api":false,"analytics_disabled_by_api":false,"google_ads_disabled_by_api":false,"pinterest_disabled_by_api":false,"bing_disabled_by_api":false,"reddit_disabled_by_api":false,"externalID_disabled_by_api":false,"facebook_prior_consent_enabled":true,"analytics_prior_consent_enabled":true,"google_ads_prior_consent_enabled":null,"pinterest_prior_consent_enabled":true,"bing_prior_consent_enabled":true,"cookiebot_integration_enabled":false,"cookiebot_facebook_consent_category":"marketing","cookiebot_analytics_consent_category":"statistics","cookiebot_tiktok_consent_category":"marketing","cookiebot_google_ads_consent_category":"marketing","cookiebot_pinterest_consent_category":"marketing","cookiebot_bing_consent_category":"marketing","consent_magic_integration_enabled":false,"real_cookie_banner_integration_enabled":false,"cookie_notice_integration_enabled":false,"cookie_law_info_integration_enabled":false,"analytics_storage":{"enabled":true,"value":"granted","filter":false},"ad_storage":{"enabled":true,"value":"granted","filter":false},"ad_user_data":{"enabled":true,"value":"granted","filter":false},"ad_personalization":{"enabled":true,"value":"granted","filter":false}},"cookie":{"disabled_all_cookie":false,"disabled_start_session_cookie":false,"disabled_advanced_form_data_cookie":false,"disabled_landing_page_cookie":false,"disabled_first_visit_cookie":false,"disabled_trafficsource_cookie":false,"disabled_utmTerms_cookie":false,"disabled_utmId_cookie":false},"tracking_analytics":{"TrafficLanding":"http://undefined","TrafficUtms":[],"TrafficUtmsId":[]},"GATags":{"ga_datalayer_type":"default","ga_datalayer_name":"dataLayerPYS"},"woo":{"enabled":true,"enabled_save_data_to_orders":true,"addToCartOnButtonEnabled":true,"addToCartOnButtonValueEnabled":true,"addToCartOnButtonValueOption":"price","singleProductId":null,"removeFromCartSelector":"form.woocommerce-cart-form .remove","addToCartCatchMethod":"add_cart_hook","is_order_received_page":false,"containOrderId":false},"edd":{"enabled":false},"cache_bypass":"1778183037"};
//# sourceURL=pys-js-extra
/* ]]> */
</script>
<script data-service="facebook" data-category="marketing" type="text/plain" defer data-cmplz-src="https://biogenixpeptides.com/wp-content/plugins/pixelyoursite/dist/scripts/public.js?ver=11.2.0.4" id="pys-js"></script>
<script type="text/javascript" id="mbz-cart-fixes-js-after">
/* <![CDATA[ */
    (function () {
      var cartUrl = "https:\/\/biogenixpeptides.com\/cart\/";

      function patchCartTrigger() {
        var a = document.querySelector("a.lnk-cart");
        if (!a) return;

        // Turn into a normal link
        a.setAttribute("href", cartUrl);

        // Remove Bootstrap dropdown triggers
        a.removeAttribute("data-toggle");     // Bootstrap 4
        a.removeAttribute("data-bs-toggle");  // Bootstrap 5
        a.classList.remove("dropdown-toggle");
      }

      // Run now + after Woo updates header fragments
      patchCartTrigger();
      document.addEventListener("DOMContentLoaded", patchCartTrigger);
      document.body.addEventListener("wc_fragments_refreshed", patchCartTrigger);
      document.body.addEventListener("added_to_cart", patchCartTrigger);
    })();
    
//# sourceURL=mbz-cart-fixes-js-after
/* ]]> */
</script>
<script type="text/javascript" id="cmplz-cookiebanner-js-extra">
/* <![CDATA[ */
var complianz = {"prefix":"cmplz_","user_banner_id":"1","set_cookies":[],"block_ajax_content":"0","banner_version":"31","version":"7.4.6","store_consent":"","do_not_track_enabled":"","consenttype":"optout","region":"us","geoip":"","dismiss_timeout":"","disable_cookiebanner":"","soft_cookiewall":"","dismiss_on_scroll":"","cookie_expiry":"365","url":"https://biogenixpeptides.com/wp-json/complianz/v1/","locale":"lang=en&locale=en_US","set_cookies_on_root":"0","cookie_domain":"","current_policy_id":"15","cookie_path":"/","categories":{"statistics":"statistics","marketing":"marketing"},"tcf_active":"","placeholdertext":"Click to accept {category} cookies and enable this content","css_file":"https://biogenixpeptides.com/wp-content/uploads/complianz/css/banner-{banner_id}-{type}.css?v=31","page_links":{"us":{"cookie-statement":{"title":"","url":"https://biogenixpeptides.com/"}}},"tm_categories":"","forceEnableStats":"","preview":"","clean_cookies":"","aria_label":"Click to accept {category} cookies and enable this content"};
//# sourceURL=cmplz-cookiebanner-js-extra
/* ]]> */
</script>
<script defer type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/complianz-gdpr/cookiebanner/js/complianz.min.js?ver=1776680216" id="cmplz-cookiebanner-js"></script>
<script type="text/javascript" id="cmplz-cookiebanner-js-after">
/* <![CDATA[ */
    
		if ('undefined' != typeof window.jQuery) {
			jQuery(document).ready(function ($) {
				$(document).on('elementor/popup/show', () => {
					let rev_cats = cmplz_categories.reverse();
					for (let key in rev_cats) {
						if (rev_cats.hasOwnProperty(key)) {
							let category = cmplz_categories[key];
							if (cmplz_has_consent(category)) {
								document.querySelectorAll('[data-category="' + category + '"]').forEach(obj => {
									cmplz_remove_placeholder(obj);
								});
							}
						}
					}

					let services = cmplz_get_services_on_page();
					for (let key in services) {
						if (services.hasOwnProperty(key)) {
							let service = services[key].service;
							let category = services[key].category;
							if (cmplz_has_service_consent(service, category)) {
								document.querySelectorAll('[data-service="' + service + '"]').forEach(obj => {
									cmplz_remove_placeholder(obj);
								});
							}
						}
					}
				});
			});
		}
    
    
		
			document.addEventListener("cmplz_enable_category", function(consentData) {
				var category = consentData.detail.category;
				var services = consentData.detail.services;
				var blockedContentContainers = [];
				let selectorVideo = '.cmplz-elementor-widget-video-playlist[data-category="'+category+'"],.elementor-widget-video[data-category="'+category+'"]';
				let selectorGeneric = '[data-cmplz-elementor-href][data-category="'+category+'"]';
				for (var skey in services) {
					if (services.hasOwnProperty(skey)) {
						let service = skey;
						selectorVideo +=',.cmplz-elementor-widget-video-playlist[data-service="'+service+'"],.elementor-widget-video[data-service="'+service+'"]';
						selectorGeneric +=',[data-cmplz-elementor-href][data-service="'+service+'"]';
					}
				}
				document.querySelectorAll(selectorVideo).forEach(obj => {
					let elementService = obj.getAttribute('data-service');
					if ( cmplz_is_service_denied(elementService) ) {
						return;
					}
					if (obj.classList.contains('cmplz-elementor-activated')) return;
					obj.classList.add('cmplz-elementor-activated');

					if ( obj.hasAttribute('data-cmplz_elementor_widget_type') ){
						let attr = obj.getAttribute('data-cmplz_elementor_widget_type');
						obj.classList.removeAttribute('data-cmplz_elementor_widget_type');
						obj.classList.setAttribute('data-widget_type', attr);
					}
					if (obj.classList.contains('cmplz-elementor-widget-video-playlist')) {
						obj.classList.remove('cmplz-elementor-widget-video-playlist');
						obj.classList.add('elementor-widget-video-playlist');
					}
					obj.setAttribute('data-settings', obj.getAttribute('data-cmplz-elementor-settings'));
					blockedContentContainers.push(obj);
				});

				document.querySelectorAll(selectorGeneric).forEach(obj => {
					let elementService = obj.getAttribute('data-service');
					if ( cmplz_is_service_denied(elementService) ) {
						return;
					}
					if (obj.classList.contains('cmplz-elementor-activated')) return;

					if (obj.classList.contains('cmplz-fb-video')) {
						obj.classList.remove('cmplz-fb-video');
						obj.classList.add('fb-video');
					}

					obj.classList.add('cmplz-elementor-activated');
					obj.setAttribute('data-href', obj.getAttribute('data-cmplz-elementor-href'));
					blockedContentContainers.push(obj.closest('.elementor-widget'));
				});

				/**
				 * Trigger the widgets in Elementor
				 */
				for (var key in blockedContentContainers) {
					if (blockedContentContainers.hasOwnProperty(key) && blockedContentContainers[key] !== undefined) {
						let blockedContentContainer = blockedContentContainers[key];
						if (elementorFrontend.elementsHandler) {
							elementorFrontend.elementsHandler.runReadyTrigger(blockedContentContainer)
						}
						var cssIndex = blockedContentContainer.getAttribute('data-placeholder_class_index');
						blockedContentContainer.classList.remove('cmplz-blocked-content-container');
						blockedContentContainer.classList.remove('cmplz-placeholder-' + cssIndex);
					}
				}

			});
		
		
//# sourceURL=cmplz-cookiebanner-js-after
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=4.0.4" id="elementor-pro-webpack-runtime-js"></script>
<script type="text/javascript" id="elementor-pro-frontend-js-before">
/* <![CDATA[ */
var ElementorProFrontendConfig = {"ajaxurl":"https:\/\/biogenixpeptides.com\/wp-admin\/admin-ajax.php","nonce":"260af33cfe","urls":{"assets":"https:\/\/biogenixpeptides.com\/wp-content\/plugins\/elementor-pro\/assets\/","rest":"https:\/\/biogenixpeptides.com\/wp-json\/"},"settings":{"lazy_load_background_images":true},"popup":{"hasPopUps":true},"shareButtonsNetworks":{"facebook":{"title":"Facebook","has_counter":true},"twitter":{"title":"Twitter"},"linkedin":{"title":"LinkedIn","has_counter":true},"pinterest":{"title":"Pinterest","has_counter":true},"reddit":{"title":"Reddit","has_counter":true},"vk":{"title":"VK","has_counter":true},"odnoklassniki":{"title":"OK","has_counter":true},"tumblr":{"title":"Tumblr"},"digg":{"title":"Digg"},"skype":{"title":"Skype"},"stumbleupon":{"title":"StumbleUpon","has_counter":true},"mix":{"title":"Mix"},"telegram":{"title":"Telegram"},"pocket":{"title":"Pocket","has_counter":true},"xing":{"title":"XING","has_counter":true},"whatsapp":{"title":"WhatsApp"},"email":{"title":"Email"},"print":{"title":"Print"},"x-twitter":{"title":"X"},"threads":{"title":"Threads"}},"woocommerce":{"menu_cart":{"cart_page_url":"https:\/\/biogenixpeptides.com\/cart\/","checkout_page_url":"https:\/\/biogenixpeptides.com\/checkout\/","fragments_nonce":"0d7b9a1a6b"}},"facebook_sdk":{"lang":"en_US","app_id":""},"lottie":{"defaultAnimationUrl":"https:\/\/biogenixpeptides.com\/wp-content\/plugins\/elementor-pro\/modules\/lottie\/assets\/animations\/default.json"}};
//# sourceURL=elementor-pro-frontend-js-before
/* ]]> */
</script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=4.0.4" id="elementor-pro-frontend-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js?ver=4.0.4" id="pro-elements-handlers-js"></script>
<script type="text/javascript" src="https://biogenixpeptides.com/wp-content/plugins/medibazar-core/elementor/custom-scripts.js?ver=6.9.4" id="medibazar-core-custom-scripts-js"></script>
    <style>
    #bgx-age-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(5, 5, 20, 0.92);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        padding: 20px;
        box-sizing: border-box;
    }

    #bgx-age-overlay.bgx-hidden {
        display: none;
    }

    #bgx-age-card-wrapper {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
        border-radius: 20px;
        padding: 3px;
        max-width: 520px;
        width: 100%;
        box-shadow: 0 0 60px rgba(139, 92, 246, 0.4), 0 25px 50px rgba(0,0,0,0.5);
    }

    #bgx-age-card {
        background: #ffffff;
        border-radius: 18px;
        padding: 36px 32px 28px;
        max-height: 90vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #e2e8f0 transparent;
    }

    #bgx-age-card::-webkit-scrollbar {
        width: 4px;
    }
    #bgx-age-card::-webkit-scrollbar-track {
        background: transparent;
    }
    #bgx-age-card::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }

    .bgx-logo-wrap {
        text-align: center;
        margin-bottom: 16px;
    }

    .bgx-logo-wrap img {
        max-width: 200px;
        height: auto;
    }

    .bgx-divider {
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border: none;
        border-radius: 2px;
        margin: 0 0 20px 0;
    }

    .bgx-title {
        text-align: center;
        font-size: 22px;
        font-weight: 800;
        color: #1a1a3e;
        letter-spacing: 0.5px;
        line-height: 1.3;
        margin: 0 0 10px 0;
        text-transform: uppercase;
    }

    .bgx-subtitle {
        text-align: center;
        font-size: 13px;
        color: #64748b;
        margin: 0 0 22px 0;
        line-height: 1.5;
    }

    .bgx-checkbox-block {
        border: 1.5px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 14px;
        display: flex;
        gap: 14px;
        align-items: flex-start;
        transition: border-color 0.2s;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }

    .bgx-checkbox-block:hover {
        border-color: #8b5cf6;
    }

    .bgx-checkbox-block.bgx-checked {
        border-color: #3b82f6;
        background: #f0f7ff;
    }

    .bgx-checkbox-block input[type="checkbox"] {
        width: 20px;
        height: 20px;
        min-width: 20px;
        margin-top: 2px;
        cursor: pointer;
        accent-color: #3b82f6;
        border-radius: 4px;
    }

    .bgx-checkbox-label {
        font-size: 13px;
        color: #374151;
        line-height: 1.6;
    }

    .bgx-checkbox-label strong {
        display: block;
        font-size: 14px;
        font-weight: 700;
        color: #1a1a3e;
        margin-bottom: 6px;
    }

    .bgx-btn-agree {
        display: block;
        width: 100%;
        padding: 16px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
        color: #fff;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 20px;
        margin-bottom: 10px;
        transition: opacity 0.2s, transform 0.1s;
    }

    .bgx-btn-agree:hover {
        opacity: 0.92;
        transform: translateY(-1px);
    }

    .bgx-btn-agree:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        transform: none;
    }

    .bgx-btn-exit {
        display: block;
        width: 100%;
        padding: 14px;
        background: transparent;
        color: #374151;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        border: 1.5px solid #d1d5db;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s;
    }

    .bgx-btn-exit:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }

    .bgx-footer-note {
        text-align: center;
        margin-top: 16px;
        font-size: 11px;
        color: #94a3b8;
        line-height: 1.5;
    }

    .bgx-footer-note .bgx-lock {
        font-size: 14px;
        display: block;
        margin-bottom: 4px;
    }

    /* Exit message overlay */
    #bgx-exit-screen {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(5, 5, 20, 0.97);
        z-index: 9999999;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 40px;
        box-sizing: border-box;
    }

    #bgx-exit-screen.bgx-show {
        display: flex;
    }

    #bgx-exit-screen p {
        color: #ffffff;
        font-size: 22px;
        font-weight: 600;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        max-width: 400px;
        line-height: 1.5;
    }

    @media (max-width: 480px) {
        #bgx-age-card {
            padding: 24px 18px 20px;
        }
        .bgx-title {
            font-size: 18px;
        }
    }
    </style>

    <!-- Age Gate Overlay -->
    <div id="bgx-age-overlay">
        <div id="bgx-age-card-wrapper">
            <div id="bgx-age-card">

                <div class="bgx-logo-wrap">
                    <img src="https://biogenixpeptides.com/wp-content/uploads/2026/03/BGX-Website-Logo.png" alt="BioGenix Peptides" />
                </div>

                <hr class="bgx-divider">

                <h2 class="bgx-title">Research Use &amp; Access<br>Confirmation</h2>
                <p class="bgx-subtitle">Before entering this website, please read and agree<br>to the following statement:</p>

                <!-- Checkbox 1 -->
                <label class="bgx-checkbox-block" id="bgx-block-1" for="bgx-chk-1">
                    <input type="checkbox" id="bgx-chk-1" onchange="bgxUpdateBtn()">
                    <div class="bgx-checkbox-label">
                        <strong>I am a researcher and agree to the following:</strong>
                        I confirm that I am a qualified researcher or laboratory professional and that all products purchased from BioGenix Peptides are intended for laboratory and research use only. I understand that all compounds are NOT for human use and are not intended for diagnostic, therapeutic, or any other use in humans or animals. I understand that all content provided on this website, including but not limited to product information, descriptions, articles, videos, blogs, communications, and other materials, is provided for theoretical and educational purposes only. I acknowledge that this content is not intended to, and does not, constitute medical advice, diagnosis, treatment, or dosing recommendations. I agree that nothing on this site should be construed as advice from a licensed medical professional. I assume full responsibility for any use or misuse of information or products obtained from this site. I release and hold harmless BioGenix Peptides, its owners, employees, affiliates, and partners from any and all liability, claims, damages, or expenses arising from the use or inability to use any product or information provided.
                    </div>
                </label>

                <!-- Checkbox 2 -->
                <label class="bgx-checkbox-block" id="bgx-block-2" for="bgx-chk-2">
                    <input type="checkbox" id="bgx-chk-2" onchange="bgxUpdateBtn()">
                    <div class="bgx-checkbox-label">
                        <strong>I am 21 years of age or older.</strong>
                        I confirm that I am at least 21 years of age.
                    </div>
                </label>

                <button class="bgx-btn-agree" id="bgx-btn-agree" disabled onclick="bgxAgree()">I Agree &amp; Enter</button>
                <button class="bgx-btn-exit" onclick="bgxExit()">Exit Site</button>

                <div class="bgx-footer-note">
                    <span class="bgx-lock">🔒</span>
                    By proceeding, you confirm that you have read, understood,<br>and agree to all of the above statements.
                </div>

            </div>
        </div>
    </div>

    <!-- Exit Screen -->
    <div id="bgx-exit-screen">
        <p>You are not old enough to view this content.</p>
    </div>

    <script>
    (function() {
        // Check cookie on load
        function getCookie(name) {
            var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        }

        if (getCookie('bgx_age_verified') === '1') {
            var overlay = document.getElementById('bgx-age-overlay');
            if (overlay) overlay.classList.add('bgx-hidden');
        }

        // Prevent body scroll when overlay is visible
        var overlay = document.getElementById('bgx-age-overlay');
        if (overlay && !overlay.classList.contains('bgx-hidden')) {
            document.body.style.overflow = 'hidden';
        }
    })();

    function bgxUpdateBtn() {
        var c1 = document.getElementById('bgx-chk-1').checked;
        var c2 = document.getElementById('bgx-chk-2').checked;
        document.getElementById('bgx-block-1').classList.toggle('bgx-checked', c1);
        document.getElementById('bgx-block-2').classList.toggle('bgx-checked', c2);
        document.getElementById('bgx-btn-agree').disabled = !(c1 && c2);
    }

    function bgxAgree() {
        // Set cookie for 30 days
        var expires = new Date();
        expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = 'bgx_age_verified=1; expires=' + expires.toUTCString() + '; path=/';

        // Hide overlay
        var overlay = document.getElementById('bgx-age-overlay');
        overlay.classList.add('bgx-hidden');
        document.body.style.overflow = '';
    }

    function bgxExit() {
        // Show exit message
        document.getElementById('bgx-exit-screen').classList.add('bgx-show');
        // Optionally hide the main overlay
        document.getElementById('bgx-age-overlay').classList.add('bgx-hidden');
    }
    </script>
        <script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9f82bcd4bc212201',t:'MTc3ODE4MzI1OA=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>