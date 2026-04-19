interface Props { visible: boolean }

export function JiraTicketOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center">
            <div
                className="animate-pop-in rounded-lg overflow-hidden shadow-2xl"
                style={{
                    background: '#1d2125',
                    border: '1px solid #2c333a',
                    minWidth: '360px',
                    maxWidth: '440px',
                }}
            >
                {/* Header */}
                <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ background: '#0052cc' }}
                >
                    <span className="text-white font-bold text-sm">🐛 SMASH-404</span>
                    <span
                        className="ml-auto text-xs px-2 py-0.5 rounded font-semibold"
                        style={{ background: '#e74c3c', color: '#fff' }}
                    >
                        Bug
                    </span>
                </div>

                {/* Body */}
                <div className="px-4 py-4 space-y-3">
                    <h2 className="text-white font-bold text-base">User forgot to do work</h2>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span style={{ color: '#8c9bab' }}>Priority</span>
                            <div className="text-white mt-0.5 flex items-center gap-1">
                                <span>🔵</span> Low
                            </div>
                        </div>
                        <div>
                            <span style={{ color: '#8c9bab' }}>Status</span>
                            <div
                                className="mt-0.5 text-xs font-bold px-2 py-0.5 rounded inline-block"
                                style={{ background: '#3d4a56', color: '#8c9bab' }}
                            >
                                BACKLOG
                            </div>
                        </div>
                        <div>
                            <span style={{ color: '#8c9bab' }}>Reporter</span>
                            <div className="text-white mt-0.5">You</div>
                        </div>
                        <div>
                            <span style={{ color: '#8c9bab' }}>Assignee</span>
                            <div className="text-white mt-0.5">Unassigned</div>
                        </div>
                    </div>

                    <div className="text-xs" style={{ color: '#6c7a89', borderTop: '1px solid #2c333a', paddingTop: '0.75rem' }}>
                        Created just now
                    </div>
                </div>
            </div>
        </div>
    );
}
