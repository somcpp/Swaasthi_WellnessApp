// Note: API key should be stored securely in backend, not client-side
const YOUTUBE_API_KEY = 'AIzaSyDtrqKierdGYGnMeQXayVLbEhYPehkRZkE'; // Replace with actual key in production

async function showRemedies() {
    const elements = {
        symptom: document.getElementById('symptom-input'),
        severity: document.getElementById('severity-input'),
        age: document.getElementById('age-input'),
        gender: document.getElementById('gender-input'),
        results: document.getElementById('results'),
        loader: document.getElementById('loader'),
        remedyText: document.getElementById('remedy-text'),
        yogaContainer: document.getElementById('yoga-poses'),
        prepList: document.getElementById('prep-list')
    };

    if (Object.values(elements).some(el => !el)) {
        alert('Required page elements are missing!');
        return;
    }

    const symptom = elements.symptom.value.trim();
    const severity = elements.severity.value;
    const age = parseInt(elements.age.value);
    const gender = elements.gender.value;

    if (!symptom || !severity || !gender || isNaN(age) || age <= 0) {
        alert('Please provide valid values for all fields!');
        return;
    }

    elements.loader.style.display = 'inline-block';

    try {
        const geminiResponse = await fetch('https://gemini-7kns.onrender.com/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `Give exactly 3 ayurvedic home remedies and exactly 2 yoga poses for ${symptom} (${severity} severity) in ${age} year old ${gender}.
                Format strictly like:
                Home Remedies: 1. x | 2. y | 3. z
                Yoga: y,z
                Do not include anything else in the response.`
            })
        });

        if (!geminiResponse.ok) {
            throw new Error('Gemini API request failed');
        }

        const geminiData = await geminiResponse.json();
        const resultText = geminiData.result || "";

        const remedyMatch = resultText.match(/Home Remedies:\s*([^|\n]+(?:\|[^|\n]+)*)/i);
        const yogaMatch = resultText.match(/Yoga:\s*([^|\n]+)/i);

        const homeRemedies = remedyMatch ? remedyMatch[1].split('|').map(r => r.trim()) : ['No remedies provided'];
        const yogaPoses = yogaMatch ? yogaMatch[1].split(',').map(p => p.trim()) : [];

        elements.remedyText.innerHTML = homeRemedies.map(r => `🌿 ${r}`).join('<br>');
        elements.yogaContainer.innerHTML = '';
        elements.results.classList.add('active');
        elements.loader.style.display = 'none';

        await Promise.all(yogaPoses.map((yoga, index) =>
            createYogaPoseElement(yoga, index)
                .then(yogaDiv => elements.yogaContainer.appendChild(yogaDiv))
        ));

        const prepResponse = await fetch('https://gemini-7kns.onrender.com/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `List 3-4 concise professional and ayurvedic suggestions (no chemical medicines) for ${symptom} (${severity} severity) in ${age} year old ${gender}.
                Format each as one numbered line without explanations. Max 20 words per suggestion.
                Example:
                1. Drink ginger tea twice daily
                2. Practice deep breathing exercises
                3. Apply warm sesame oil massage`
            })
        });

        if (!prepResponse.ok) {
            throw new Error('Preparation API request failed');
        }

        const prepData = await prepResponse.json();
        const responseText = prepData.result || "";

        const suggestions = responseText
            .split('\n')
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line && !line.toLowerCase().includes('suggestion'))
            .slice(0, 4);

        elements.prepList.innerHTML = suggestions.length
            ? suggestions.map(s => `<li>📝 ${s}</li>`).join('')
            : '<li>No suggestions available</li>';

        elements.results.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to fetch remedy: ${error.message}`);
        elements.loader.style.display = 'none';
        elements.prepList.innerHTML = '<li>Failed to load professional suggestions</li>';
    }
}

async function createYogaPoseElement(yoga, index) {
    const youtubeId = await fetchYoutubeVideoId(yoga);
    
    const yogaDiv = document.createElement('div');
    yogaDiv.className = 'yoga-pose';
    yogaDiv.innerHTML = `
        <h3>${yoga}</h3>
        <div class="yoga-details">
            <div class="yoga-main-column">
                <div class="video-container">
                    <div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/${youtubeId || 'dQMpDqL3x6k'}?modestbranding=1&rel=0&enablejsapi=1" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    </div>
                </div>
                <div class="steps-section">
                    <h4>Steps</h4>
                    <ol id="yoga-steps-${index}"><li>Loading steps...</li></ol>
                </div>
            </div>
            <div class="yoga-side-column">
                <div class="benefits-section">
                    <h4>Benefits</h4>
                    <ul id="yoga-benefits-${index}"><li>Loading benefits...</li></ul>
                </div>
                <div class="cautions-section">
                    <h4>Cautions</h4>
                    <ul id="yoga-cautions-${index}"><li>Loading cautions...</li></ul>
                </div>
            </div>
        </div>
    `;

    fetchYogaDetails(yoga, index);
    return yogaDiv;
}

async function fetchYoutubeVideoId(poseName) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&` +
            `q=${encodeURIComponent(poseName + " yoga tutorial")}&` +
            `type=video&` +
            `key=${YOUTUBE_API_KEY}&` +
            `maxResults=1`
        );

        if (!response.ok) throw new Error('YouTube API request failed');
        const data = await response.json();
        return data.items?.[0]?.id?.videoId || 'dQMpDqL3x6k';
    } catch (error) {
        console.error('YouTube API error:', error);
        return 'dQMpDqL3x6k';
    }
}

async function fetchYogaDetails(yoga, index) {
    try {
        const response = await fetch('https://gemini-7kns.onrender.com/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `For ${yoga} yoga pose, provide in EXACT format:
                Steps: 1. First step (max 15 words) | 2. Second step (max 15 words) | 3. Third step (max 15 words)
                Benefits: 1. First benefit (max 12 words) | 2. Second benefit (max 12 words) | 3. Third benefit (max 12 words) | 4. Fourth benefit (max 12 words)
                Cautions: 1. First caution (max 12 words) | 2. Second caution (max 12 words) | 3. Third caution (max 12 words) | 4. Fourth caution (max 12 words)
                Use numbered format as shown. Do not include extra text.`
            })
        });

        if (!response.ok) throw new Error('Yoga details API failed');
        const geminiData = await response.json();
        const responseText = geminiData.result || "";

        const parseSection = (section) => {
            const match = responseText.match(new RegExp(`${section}:\\s*([\\s\\S]*?)(?=\\n(?:Steps|Benefits|Cautions)|$)`));
            if (!match || !match[1]) return [];
            return match[1].split('|')
                .map(item => item.trim())
                .map(item => item.replace(/^\d+\.\s*/, ''))
                .filter(item => item.length > 0);
        };

        const steps = parseSection('Steps').slice(0, 3);
        const benefits = parseSection('Benefits').slice(0, 4);
        const cautions = parseSection('Cautions').slice(0, 4);

        // Only display available items without placeholders
        document.getElementById(`yoga-steps-${index}`).innerHTML = 
            steps.length > 0 
                ? steps.map(step => `<li><span class="step-text">${step}</span></li>`).join('')
                : '<li>No steps provided</li>';
        
        document.getElementById(`yoga-benefits-${index}`).innerHTML = 
            benefits.length > 0 
                ? benefits.map(b => `• ${b}`).join('<br>')
                : 'No benefits provided';
        
        document.getElementById(`yoga-cautions-${index}`).innerHTML = 
            cautions.length > 0 
                ? cautions.map(c => `⚠️ ${c}`).join('<br>')
                : 'No cautions provided';

    } catch (error) {
        console.error(`Error fetching ${yoga} details:`, error);
        document.getElementById(`yoga-steps-${index}`).innerHTML = '<li>Failed to load steps</li>';
        document.getElementById(`yoga-benefits-${index}`).innerHTML = 'Failed to load benefits';
        document.getElementById(`yoga-cautions-${index}`).innerHTML = 'Failed to load cautions';
    }
}