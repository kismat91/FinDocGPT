import { NextResponse } from 'next/server';

// This is a simple endpoint that could be extended to save articles to a database
// For now, it just returns a success response since we're using localStorage

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, article } = body;

    // In a real app, you would save to database here
    // For now, we'll just return success since localStorage handles persistence

    if (action === 'save') {
      return NextResponse.json({
        success: true,
        message: 'Article saved successfully',
        articleId: article.id
      });
    } else if (action === 'remove') {
      return NextResponse.json({
        success: true,
        message: 'Article removed successfully',
        articleId: article.id
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in portfolio API:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}

export async function GET() {
  // In a real app, you would fetch saved articles from database
  // For now, return empty array since localStorage is used on client side
  
  return NextResponse.json({
    success: true,
    savedArticles: [],
    message: 'Portfolio data is stored locally'
  });
}
