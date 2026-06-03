import { motion } from 'framer-motion'
import { Github, Linkedin, Globe, FolderGit2 } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/anirudhhbehera',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-gray-100'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/anirudhhbehera/',
      icon: Linkedin,
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      label: 'Portfolio',
      href: 'https://anirudhh.vercel.app/',
      icon: Globe,
      color: 'hover:text-indigo-600 dark:hover:text-indigo-400'
    },
    {
      label: 'Projects',
      href: 'https://github.com/anirudhhbehera?tab=repositories',
      icon: FolderGit2,
      color: 'hover:text-green-600 dark:hover:text-green-400'
    }
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-auto card-bg border-t border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          {/* Branding */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">MediTracker</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Built by Anirudhh Behera</p>
            </div>
          </motion.div>

          {/* Social Links */}
          <div className="flex items-center space-x-2">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 ${link.color} bg-gray-100 dark:bg-gray-800 transition-all duration-200`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={link.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              )
            })}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-4" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center sm:text-right">
            © {currentYear} Anirudhh Behera. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
