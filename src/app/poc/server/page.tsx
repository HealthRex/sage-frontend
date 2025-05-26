import ServerComponent from './server-component';
import ClientComponent from './client-component';


export default function HomePage() {
    return (
        <div>
            <header>
                <h1>My Next.js App</h1>
            </header>

            <main>
                <ServerComponent />
                <ClientComponent />
            </main>
        </div>
    );
}