import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch the full article
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract article content using common selectors
    let articleContent = '';
    
    // Remove unwanted elements first
    const unwantedSelectors = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
      '.advertisement',
      '.ads',
      '.ad',
      '.social-share',
      '.share-buttons',
      '.related-articles',
      '.sidebar',
      '.comments',
      '.comment',
      '.navigation',
      '.breadcrumb',
      '.menu',
      '.popup',
      '.modal',
      '.overlay',
      '.cookie-notice',
      '.newsletter',
      '.subscription',
      '[class*="ad-"]',
      '[class*="ads-"]',
      '[id*="ad-"]',
      '[id*="ads-"]',
      '.widget',
      '.promo',
      '.banner',
      '.sponsor'
    ];

    unwantedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Try different common article selectors in order of preference
    const selectors = [
      '[role="article"] .content',
      'article .entry-content',
      'article .post-content',
      'article .article-content',
      '.article-body .content',
      '.post-body .content',
      '.entry-content',
      '.post-content', 
      '.article-content',
      '.story-body',
      '.article-body',
      '.post-body',
      'article',
      '[role="article"]',
      '.content-area article',
      'main article',
      '.main-content article'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Clone the element to avoid modifying original
        const clonedElement = element.cloneNode(true) as Element;
        
        // Remove additional unwanted elements from the article content
        const additionalUnwanted = [
          '.tags',
          '.tag-list',
          '.categories',
          '.meta',
          '.author-bio',
          '.author-info',
          '.published-date',
          '.social-media',
          '.share',
          '.subscribe',
          '.newsletter-signup',
          '.recommended',
          '.you-may-like',
          '.trending',
          '.popular',
          '.recent-posts',
          '.related-content',
          '.next-article',
          '.prev-article',
          '.article-navigation',
          '.pagination',
          '.load-more',
          '.read-next',
          '.more-stories',
          '.footer-content',
          '.header-content',
          'iframe',
          '.video-ad',
          '.inline-ad',
          '[class*="promo"]',
          '[class*="sponsored"]'
        ];

        additionalUnwanted.forEach(unwanted => {
          const elements = clonedElement.querySelectorAll(unwanted);
          elements.forEach(el => el.remove());
        });

        // Get text content and clean it up
        let content = clonedElement.textContent?.trim() || '';
        
        // Clean up the content
        content = content
          // Remove excessive whitespace
          .replace(/\s+/g, ' ')
          // Remove multiple newlines
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          // Remove common website cruft
          .replace(/^(Home|Menu|Navigation|Search).*$/gm, '')
          .replace(/^(Copyright|©).*$/gm, '')
          .replace(/^(Follow us|Share|Like|Tweet).*$/gm, '')
          .replace(/^(Subscribe|Newsletter|Email).*$/gm, '')
          .replace(/^(Advertisement|Sponsored|Promoted).*$/gm, '')
          .replace(/^(Read more|Continue reading|View all).*$/gm, '')
          .replace(/^(Tags:|Categories:|Filed under:).*$/gm, '')
          .replace(/^(Previous|Next|Related):.*$/gm, '')
          // Remove social media noise
          .replace(/^(Facebook|Twitter|Instagram|LinkedIn|WhatsApp).*$/gm, '')
          .replace(/^(Share on|Follow on).*$/gm, '')
          // Remove navigation elements
          .replace(/^(Blog|Home|About|Contact|Privacy Policy|Terms)$/gm, '')
          .replace(/^(Sitemap|Legal|Disclaimer)$/gm, '')
          // Remove dates that appear standalone
          .replace(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}$/gm, '')
          // Remove short lines that are likely navigation or metadata
          .split('\n')
          .filter(line => {
            const trimmed = line.trim();
            // Keep lines that are substantial content
            return trimmed.length > 20 || 
                   // But also keep short lines that look like proper sentences
                   (trimmed.length > 10 && (trimmed.includes('.') || trimmed.includes('!') || trimmed.includes('?')));
          })
          .join('\n')
          .trim();
        
        if (content.length > 300) { // Only use if substantial content
          articleContent = content;
          break;
        }
      }
    }

    // Fallback: extract paragraphs if no article content found
    if (!articleContent || articleContent.length < 300) {
      const paragraphs = Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(text => {
          if (!text || text.length < 30) return false;
          
          // Filter out common non-article paragraphs
          const lowerText = text.toLowerCase();
          const excludePatterns = [
            'subscribe', 'newsletter', 'follow us', 'share this',
            'copyright', 'all rights reserved', 'privacy policy',
            'terms of service', 'cookie policy', 'advertisement',
            'sponsored', 'promoted content', 'related articles',
            'you may also like', 'trending now', 'popular posts',
            'read more', 'continue reading', 'load more',
            'sign up', 'log in', 'create account', 'forgot password'
          ];
          
          return !excludePatterns.some(pattern => lowerText.includes(pattern));
        })
        .join('\n\n');
      
      if (paragraphs.length > articleContent.length) {
        articleContent = paragraphs;
      }
    }

    // Extract relevant images (not ads or icons)
    const images = Array.from(document.querySelectorAll('img'))
      .map(img => ({
        src: img.src,
        alt: img.alt || '',
        caption: img.getAttribute('data-caption') || img.getAttribute('title') || ''
      }))
      .filter(img => {
        if (!img.src) return false;
        
        const src = img.src.toLowerCase();
        const alt = img.alt.toLowerCase();
        
        // Filter out common non-article images
        const excludePatterns = [
          'advertisement', 'ad.', '/ads/', 'banner', 'logo', 'icon',
          'social', 'share', 'facebook', 'twitter', 'instagram',
          'avatar', 'profile', 'author', 'widget', 'sidebar',
          'footer', 'header', 'navigation', 'menu', 'button',
          'promo', 'sponsored', 'tracking', 'pixel', 'analytics'
        ];
        
        const hasExcludedPattern = excludePatterns.some(pattern => 
          src.includes(pattern) || alt.includes(pattern)
        );
        
        // Only include images that are likely part of the article content
        return !hasExcludedPattern && 
               img.src.startsWith('http') && 
               (img.alt.length > 5 || img.caption.length > 5 || 
                src.includes('content') || src.includes('article') || 
                src.includes('story') || src.includes('news'));
      });

    // Extract metadata
    const title = document.querySelector('title')?.textContent || '';
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const publishDate = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || 
                       document.querySelector('time')?.getAttribute('datetime') || '';

    // Final content cleanup and formatting
    if (articleContent) {
      articleContent = articleContent
        // Fix spacing around punctuation
        .replace(/\s+([.!?])/g, '$1')
        .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
        // Remove excessive blank lines
        .replace(/\n{3,}/g, '\n\n')
        // Remove lines that are just punctuation or very short
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.length > 3 && !/^[.!?,:;\-_=+*#@$%^&()[\]{}|\\/<>~`"']+$/.test(trimmed);
        })
        .join('\n')
        .trim();
    }

    return NextResponse.json({
      success: true,
      content: articleContent,
      title,
      metaDescription,
      publishDate,
      images: images.slice(0, 3), // Limit to 3 most relevant images
      wordCount: articleContent.split(/\s+/).length,
      readingTime: Math.ceil(articleContent.split(/\s+/).length / 200), // ~200 words per minute
      extractionQuality: articleContent.length > 500 ? 'good' : 'limited'
    });

  } catch (error) {
    console.error('Error extracting article content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to extract article content', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
