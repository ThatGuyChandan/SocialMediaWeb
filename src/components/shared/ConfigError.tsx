import { Button } from "../ui/button";

const ConfigError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-1 text-white p-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
        <p className="text-light-3 mb-6">
          GlimmerWave needs to be configured with Appwrite credentials to function properly.
        </p>
        <div className="bg-dark-2 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-2">Required Steps:</h3>
          <ol className="text-sm text-light-3 space-y-1">
            <li>1. Create an Appwrite project</li>
            <li>2. Set up database collections</li>
            <li>3. Configure storage bucket</li>
            <li>4. Create a .env file with your credentials</li>
          </ol>
        </div>
        <Button 
          onClick={() => window.open('https://console.appwrite.io/', '_blank')}
          className="shad-button_primary"
        >
          Go to Appwrite Console
        </Button>
        <p className="text-xs text-light-3 mt-4">
          Check SETUP.md for detailed instructions
        </p>
      </div>
    </div>
  );
};

export default ConfigError; 