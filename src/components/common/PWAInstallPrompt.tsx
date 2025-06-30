import React from 'react'
import { usePWA } from '../../hooks/usePWA'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { Download, X } from 'lucide-react'

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA()
  const [showPrompt, setShowPrompt] = React.useState(false)

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 30 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [isInstallable])

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setShowPrompt(false)
    }
  }

  if (!isInstallable || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Install EMS Platform
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Install our app for a better experience with offline access and push notifications.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInstall}>
                  Install
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPrompt(false)}
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAInstallPrompt