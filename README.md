This project aims to solve the problem of managing bookmarks across different operating systems and browsers. A key focus was to keep the implementation as simple as possible. The project uses only JavaScript, PHP, and HTML, with no frameworks or databases. This means there are minimal requirements for the hosting service. For example, I use the free hosting service [000webhost](https://www.000webhost.com).

## Installation

1. **Copy all files to your web server.**
2. **Edit the `credential.php` file:** Enter your user details and a long, random API key (it's not highly secure, but it's just for bookmarks).
3. **Customize the Bookmarklet with your URL:**
   
   **Bookmarklet:**
   ```javascript
   javascript: (function() {
       var url = '<myURL>/bookmark.html?url=' + encodeURIComponent(window.location.href) +
                 '&title=' + encodeURIComponent(document.title) +
                 '&mode=add';
       window.open(url, 'bookyBookmarklet', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no').focus();
   }());

    Create a bookmark: Instead of a URL, copy the above Bookmarklet script and name the bookmark "Add Bookmark".

Usage

    First, log in from the main page: You will be automatically redirected to login.html.
    Adding Bookmarks:
        To add a bookmark, use the Bookmarklet mentioned above.
