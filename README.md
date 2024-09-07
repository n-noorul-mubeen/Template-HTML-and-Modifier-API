# Documentation:

## API Endpoints:
	
 `/generate` (POST METHOD):
 
 Sample Input: 
	 
	 	{
    "template": "<html><body><div id='content'></div></body></html>",
    "content": "Hello World"
	}
 
 Ouput:

	 { 
	"html": "<html><body><div id='content'>Hello World</div></body></html> \n"
		}
 
'/modify' (POST METHOD):

Sample Input:


	{
 	"html": "<html><body><div id='content'>Old Content</div></body></html>",
	"changes": "Replace 'Old Content' with 'New Content'"
	}
 		
	 
	
Output:
	 
	{ 
 	"html": "<html><body><div id='content'>New Content</div></body></html> \n"
	}
