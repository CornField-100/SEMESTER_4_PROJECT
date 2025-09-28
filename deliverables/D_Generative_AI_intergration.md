# Intergration of a gen AI:
- At first, I tried using OpenAI models but I hit the tokens quota. Because of that, I've changed to use Google's Gemini 2.5 flash.
- The AI is implemented by llmService.js, in it I import the API key from my .env alongside the model, tokens count and temperature, all other imports besides API key has a default value. Then I design a function to export that will consume the prompt and return the AI's response.
- Because of the unique aspect of my AI chatbot, I created a prompt.js to contain the prompts for both the Teacher and Peer, cutting down the hassle and aloowing easy fixability should I need to change anything.
# Working on gen AI performance:
- Because of my experience from trying OpenAI models, for both my modes, I've set the max token count at 1024, this ensure that the response is cohesive, robust enough while still ensuring that token usage is taken into consideration. 
- For the AI temperature, I've set it at 0.25, this will keep it strictly proffesional, keeping it from being too imaginative and potentially flying off the rails.
# Look and feel:
- UX improement that I've added is easily toggable role in the chatbox and easy to read chat display.

## GitHUb repo link: https://github.com/CornField-100/SEMESTER_4_PROJECT