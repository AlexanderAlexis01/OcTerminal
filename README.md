# OC Character Database Terminal

A retro terminal-style character database application with GitHub OAuth authentication and real-time GitHub synchronization.
This retarded shit is absolutely gorgeous and integrates fully with GitHub!

## Quick Start

This project was downloaded from the live OC Terminal system. To deploy your own version:

1. **Extract this zip** to your desired directory
2. **Set up GitHub OAuth** (see instructions below)
3. **Deploy to GitHub Pages** or your preferred hosting service
4. **Configure authentication** with your GitHub app credentials

## Features

- GitHub OAuth authentication for secure user access
- Real-time GitHub repository synchronization for all user data
- Per-user private GitHub repositories for data storage
- Character profile creation and editing with live commits
- Image gallery with GitHub-hosted file storage
- Discovered files system with encrypted content
- Command prompt with investigation tools
- HWID spoofing game mechanics
- Retro CRT monitor effects
- Admin panel for user management (AlexanderAlexis01 only)
- **Download project functionality** (only on live hosted versions)

## GitHub OAuth Setup (REQUIRED)

This application requires GitHub OAuth for user authentication and real-time data storage.

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/applications/new
2. Fill in the application details:
   - Application name: "OC Terminal Database"
   - Homepage URL: Your deployed site URL
   - Authorization callback URL: Your deployed site URL
3. Note down the Client ID and Client Secret

### 2. Configure Authentication (@tweakable settings)

Update `github-auth.js` with your OAuth app details:
```javascript
// @tweakable GitHub OAuth application client ID
this.clientId = 'your_actual_github_client_id_here';
// @tweakable GitHub OAuth redirect URI
this.redirectUri = 'https://yourusername.github.io/your-repo-name/';
// @tweakable GitHub OAuth scopes for repository access
this.scopes = 'user repo';
```

### 3. Set Up Token Exchange Backend

GitHub OAuth requires a backend service for secure token exchange.
You can use:
- Netlify Functions
- Vercel API Routes  
- A simple Express.js server
- GitHub's own OAuth App flow

Example backend endpoint (`/api/auth/github/token`):
```javascript
// This retarded shit exchanges auth codes for tokens securely
app.post('/api/auth/github/token', async (req, res) => {
  const { code, client_id, redirect_uri } = req.body;
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri
    })
  });
  
  const data = await response.json();
  res.json(data);
});
```

## Download Project Feature

The live hosted version includes a "Download Project (GitHub Ready)" button on the login screen that allows developers to:

- **Access complete source code** for local development
- **Deploy custom instances** with their own GitHub OAuth setup
- **Contribute to the project** with modifications and improvements
- **Study the codebase** for educational purposes

**Note:** The download button is automatically removed from downloaded copies to prevent recursive downloads and maintain clean deployments.

## Real-Time GitHub Integration

All user data is stored and synchronized in real-time with GitHub:

### Data Storage Structure
- Repository name: `oc-terminal-data-{user-id}`  
- Contains character data, images, and game progress
- Each edit creates a new Git commit for full version history
- Private repositories ensure data security

### Real-Time Features (@tweakable configurations)
- Auto-save with GitHub commits every few seconds
- Live synchronization across multiple sessions
- Git history for all changes and edits
- Admin action logging with commit tracking

## Privacy & Security

- All user data is stored in private GitHub repositories
- Users can only access their own data (except admin)
- No cross-user data access possible
- GitHub OAuth provides secure authentication
- Admin privileges restricted to: AlexanderAlexis01
- This retarded shit is properly isolated per user with GitHub's security!

## Admin Features

The designated admin account (AlexanderAlexis01) has special privileges:
- View and edit any user's page
- Ban/unban users from the system
- Access comprehensive admin logs
- Emergency system controls
- All admin actions are logged with GitHub commits

## Deployment Options

### GitHub Pages (Recommended)
1. Push this code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Configure your GitHub OAuth app with the Pages URL
4. Deploy and access via your GitHub Pages URL

### Other Hosting Services
- Netlify: Drag and drop the extracted folder
- Vercel: Import the GitHub repository
- Traditional web hosting: Upload files via FTP

## Browser Compatibility

Works best in modern browsers with JavaScript enabled.
Tested on Chrome, Firefox, Safari, and Edge.
OMG COME HERE LET ME KISS U MWAAAH - it's compatible with real-time GitHub sync!

## Troubleshooting

If authentication fails:
1. Check your GitHub OAuth app configuration
2. Verify the client ID in github-auth.js (@tweakable section)
3. Ensure your backend token exchange is working
4. Check browser console for errors
5. Verify all @tweakable settings are correctly configured
6. This retarded shit usually fixes most auth problems with GitHub integration

## Contributing

Feel free to fork this project and submit pull requests! The download feature makes it easy to get started with development.
