const text = `Here is a summary of the article in 5 clear bullet points:
* First point is great.
* Second point is awesome.`;

const renderSummaryHTML = (text) => {
    let html = text;
    // Escape HTML
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*\*([^\*]*)$/, '<strong>$1</strong>');

    // Headers
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');

    // Unordered List items: lines starting with * or -
    html = html.replace(/^[\*-]\s+(.*)$/gm, '<li class="ul-li">$1</li>');

    // Ordered List items: lines starting with numbers
    html = html.replace(/^\d+\.\s+(.*)$/gm, '<li class="ol-li">$1</li>');

    // Wrap consecutive unordered <li> elements in <ul>
    html = html.replace(/(?:<li class="ul-li".*?>.*?<\/li>\n?)+/g, (match) => {
      return `<ul>${match.replace(/\n/g, '')}</ul>`;
    });

    // Wrap consecutive ordered <li> elements in <ol>
    html = html.replace(/(?:<li class="ol-li".*?>.*?<\/li>\n?)+/g, (match) => {
      return `<ol>${match.replace(/\n/g, '')}</ol>`;
    });

    // Italic
    html = html.replace(/\*([^\*\n<>]+)\*/g, '<em>$1</em>');
    html = html.replace(/\*([^\*\n<>]*)$/, '<em>$1</em>');

    return html;
};

console.log(renderSummaryHTML(text));
