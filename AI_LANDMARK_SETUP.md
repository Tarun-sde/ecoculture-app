# AI-Powered Landmark Recognition Setup Guide

## Overview
This enhanced AR experience uses Google Vision API for real landmark detection, Wikipedia API for rich information, and advanced caching for optimal performance.

## 🚀 Quick Start

### 1. Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Get your Google Vision API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable the Vision API
   - Create credentials (API key)
   - Copy the API key to your `.env` file:

```env
REACT_APP_GOOGLE_VISION_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies

No additional dependencies needed - the services use standard web APIs and fetch.

### 3. Test the System

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the AR Experience page
3. Upload a clear image of a landmark
4. Watch the AI detection in action!

## 🎯 Features

### Real-Time Landmark Detection
- **Google Vision API**: Accurate landmark recognition with confidence scores
- **Fallback System**: GPS-based detection when image recognition fails
- **Performance Optimization**: Image compression and web workers

### Rich Information Display
- **Wikipedia Integration**: Automatic fetching of detailed landmark information
- **Cultural Context**: Historical significance and cultural information
- **Activities & Tips**: Best time to visit, activities, nearby places

### Advanced Error Handling
- **Smart Retry**: Automatic retry with exponential backoff
- **User-Friendly Messages**: Clear error descriptions and actionable suggestions
- **Graceful Degradation**: Fallback options when services are unavailable

### Immersive AR Experience
- **Three Modes**: Minimal, Detailed, and Immersive viewing
- **Interactive Hotspots**: Clickable information points on images
- **Zoom & Pan**: Detailed image exploration
- **Full-screen Support**: Immersive viewing experience

### Performance Features
- **Smart Caching**: 24-hour cache for recognition results and Wikipedia data
- **Image Optimization**: Automatic compression before API calls
- **Batch Processing**: Queue management for API requests
- **Memory Management**: Intelligent cache cleanup

## 🔧 Configuration

### Performance Settings

Adjust in your `.env` file:

```env
# Image processing
REACT_APP_MAX_IMAGE_SIZE_MB=5
REACT_APP_COMPRESSION_QUALITY=0.8

# Caching
REACT_APP_CACHE_EXPIRY_HOURS=24

# Performance monitoring
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
```

### Confidence Thresholds

The system uses these default confidence levels:
- **High Confidence**: 90%+ (cached for 7 days)
- **Medium Confidence**: 70-89% (cached for 24 hours)  
- **Low Confidence**: <70% (triggers fallback detection)

## 🎨 Usage Examples

### Basic Image Upload
```typescript
// The system automatically handles:
// 1. Image validation and optimization
// 2. Google Vision API detection
// 3. Wikipedia information fetching
// 4. Error handling and retry logic
// 5. Caching for future requests
```

### Camera Capture
- Requests camera permission
- Uses rear camera for better landmark capture
- Automatically processes and analyzes captured images
- Falls back to sample images if camera unavailable

### AR Overlay Experience
- Three viewing modes for different use cases
- Interactive hotspots for detailed exploration
- Full-screen immersive experience
- Zoom and pan capabilities

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working**
- Verify the API key is correct in `.env`
- Ensure Vision API is enabled in Google Cloud Console
- Check API quotas and billing

**No Landmarks Detected**
- Ensure image shows a clear, recognizable landmark
- Try different angles or lighting
- Use images with famous landmarks for testing

**Slow Performance**
- Enable image compression in settings
- Check internet connection
- Clear browser cache

**Camera Not Working**
- Allow camera permissions in browser
- Use HTTPS (required for camera access)
- System falls back to sample images automatically

### Error Messages

The system provides clear error messages with suggested actions:

- **Network Error**: Check internet connection
- **Permission Denied**: Allow camera/location access
- **Low Confidence**: Upload clearer image
- **API Error**: Service temporarily unavailable

## 🎯 Best Practices

### For Best Results

1. **Image Quality**: Use clear, well-lit images of landmarks
2. **Landmark Visibility**: Ensure the landmark fills most of the frame
3. **Famous Landmarks**: System works best with well-known tourist destinations
4. **Network**: Stable internet connection for optimal performance

### Performance Tips

1. **Enable All Optimizations**: Use default performance settings
2. **Regular Cache Cleanup**: Automatic cleanup maintains performance
3. **Batch Operations**: Multiple API calls are automatically batched
4. **Monitor Metrics**: Check performance stats in browser console

## 🔄 API Integration Details

### Google Vision API
- **Endpoint**: `https://vision.googleapis.com/v1/images:annotate`
- **Features**: Landmark detection, text detection
- **Rate Limits**: Managed automatically with queuing
- **Error Handling**: Comprehensive retry logic

### Wikipedia API
- **Endpoint**: `https://en.wikipedia.org/w/api.php`
- **Features**: Search, geosearch, page details
- **No Auth Required**: Public API
- **Caching**: Aggressive caching for performance

## 📊 Performance Monitoring

The system automatically tracks:
- Image processing time
- API call latency
- Cache hit rates
- Memory usage
- Network performance

Access metrics via browser developer tools console.

## 🛡️ Security Considerations

- API keys stored in environment variables
- Client-side image processing (no server uploads)
- HTTPS required for camera access
- No personal data stored or transmitted

## 🆘 Support

If you encounter issues:

1. Check browser console for detailed error messages
2. Verify API key configuration
3. Test with sample landmark images
4. Review network connectivity
5. Clear browser cache and try again

The system includes comprehensive error handling and will guide you through most issues automatically.