import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtists } from '../Spotify';
import { SectionWrapper, ArtistGrid, TimeRangeButtons, Loader } from '../components';

const TopArtists = () => {
    const [topArtists, setTopArtists] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {          
            const userTopArtists = await getTopArtists(`${activeRange}_term`);
            setTopArtists(userTopArtists);
        }

        catchErrors(fetchData());
    }, [activeRange]) 

    return (
        <main>
            {topArtists ? (
                <SectionWrapper title="Top Artists" breadcrumb={true}>
                    <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange} />
                    <ArtistGrid artists={topArtists.data.items} />
                </SectionWrapper>
            ) : (
                <Loader />
            )}
        </main>
    )
}

export default TopArtists;
