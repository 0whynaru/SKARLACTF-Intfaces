{{-- resources/views/admin/dashboard.blade.php --}}
@extends('layouts.ctf')
@section('title', 'Admin Dashboard')

@section('content')
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
    <div>
        <div style="font-size:10px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:4px">
            <i class="ti ti-settings"></i> Admin Panel
        </div>
        <h1 style="font-family:var(--head);font-size:20px;color:var(--text)">Dashboard</h1>
    </div>
    <div style="display:flex;gap:8px">
        <a href="{{ route('admin.challenges.create') }}" class="btn btn-primary btn-sm">
            <i class="ti ti-plus"></i> Tambah Challenge
        </a>
        <a href="{{ route('admin.submissions') }}" class="btn btn-secondary btn-sm">
            <i class="ti ti-list"></i> Submissions
        </a>
    </div>
</div>

{{-- STAT CARDS --}}
<div class="grid-4" style="margin-bottom:24px">
    <div class="card stat-card">
        <div class="stat-label">Total Tim</div>
        <div class="stat-val c-cyan">{{ $stats['total_teams'] }}</div>
        <div class="stat-sub">Peserta terdaftar</div>
    </div>
    <div class="card stat-card">
        <div class="stat-label">Total Challenge</div>
        <div class="stat-val c-amber">{{ $stats['total_challenges'] }}</div>
        <div class="stat-sub">{{ $stats['active'] ?? 0 }} aktif</div>
    </div>
    <div class="card stat-card">
        <div class="stat-label">Total Submit</div>
        <div class="stat-val c-green">{{ number_format($stats['total_submissions']) }}</div>
        <div class="stat-sub">{{ number_format($stats['correct_submissions']) }} benar</div>
    </div>
    <div class="card stat-card">
        <div class="stat-label">Accuracy</div>
        @php $acc = $stats['total_submissions'] > 0 ? round($stats['correct_submissions'] / $stats['total_submissions'] * 100) : 0; @endphp
        <div class="stat-val c-{{ $acc > 50 ? 'green' : ($acc > 25 ? 'amber' : 'red') }}">{{ $acc }}%</div>
        <div class="stat-sub">Flag accuracy rate</div>
    </div>
</div>

<div class="grid-2" style="margin-bottom:24px">
    {{-- Top Teams --}}
    <div class="card">
        <div class="card-header"><i class="ti ti-trophy"></i> Top 10 Tim</div>
        <table class="ctf-table">
            <thead>
                <tr><th>#</th><th>Tim</th><th>Score</th></tr>
            </thead>
            <tbody>
                @foreach($topTeams as $i => $team)
                <tr>
                    <td style="color:var(--muted);width:36px">
                        @if($i === 0) <span style="color:var(--amber)">🥇</span>
                        @elseif($i === 1) <span style="color:var(--muted)">🥈</span>
                        @elseif($i === 2) <span style="color:var(--red)">🥉</span>
                        @else {{ $i + 1 }}
                        @endif
                    </td>
                    <td>
                        <div style="font-size:13px">{{ $team->team_name ?? $team->name }}</div>
                        <div style="font-size:11px;color:var(--muted)">{{ $team->name }}</div>
                    </td>
                    <td style="color:var(--green);font-family:var(--head);font-size:14px">
                        {{ number_format($team->total_score) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    {{-- Category Stats --}}
    <div class="card">
        <div class="card-header"><i class="ti ti-chart-bar"></i> Solves per Kategori</div>
        <div style="padding:16px;display:flex;flex-direction:column;gap:14px">
            @foreach($categoryStats as $cat)
            @php $pct = $cat->challenge_count > 0 ? min(100, round($cat->total_solves / ($cat->challenge_count * max(1, \DB::table('users')->where('is_admin',false)->count())) * 100)) : 0; @endphp
            <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
                    <span style="color:var(--text)">{{ $cat->name }}</span>
                    <span style="color:var(--muted)">{{ $cat->total_solves }} solves · {{ $cat->challenge_count }} soal</span>
                </div>
                <div style="height:4px;background:var(--border);border-radius:2px">
                    <div style="height:100%;width:{{ $pct }}%;background:var(--cyan);border-radius:2px;transition:.5s"></div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>

{{-- Recent Activity --}}
<div class="card" style="margin-bottom:24px">
    <div class="card-header"><i class="ti ti-activity"></i> Aktivitas Terbaru (24 jam)</div>
    <table class="ctf-table">
        <thead>
            <tr><th>Waktu</th><th>Tim</th><th>Challenge</th><th>Status</th><th>Points</th></tr>
        </thead>
        <tbody>
            @foreach($recentActivity as $sub)
            <tr>
                <td style="color:var(--muted);font-size:12px">{{ $sub->submitted_at->format('H:i:s') }}</td>
                <td>{{ $sub->user->team_name ?? $sub->user->name }}</td>
                <td style="font-size:12px">{{ $sub->challenge->title ?? '-' }}</td>
                <td>
                    @if($sub->is_correct)
                        <span class="badge badge-green"><i class="ti ti-check"></i> Correct</span>
                    @else
                        <span class="badge badge-red"><i class="ti ti-x"></i> Wrong</span>
                    @endif
                </td>
                <td style="color:{{ $sub->is_correct ? 'var(--green)' : 'var(--muted)' }}">
                    {{ $sub->is_correct ? '+' . $sub->points_awarded : '-' }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

{{-- CTF Config --}}
<div class="card">
    <div class="card-header"><i class="ti ti-adjustments"></i> Konfigurasi Event</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.config.update') }}">
            @csrf
            @php
                $cfg = \DB::table('ctf_configs')->pluck('value','key');
            @endphp
            <div class="grid-2" style="gap:20px">
                <div class="form-group">
                    <label class="form-label">Nama Event</label>
                    <input type="text" name="event_name" class="form-input" value="{{ $cfg['event_name'] ?? '' }}">
                </div>
                <div class="form-group">
                    <label class="form-label">Max Attempts (0 = unlimited)</label>
                    <input type="number" name="max_attempts" class="form-input" value="{{ $cfg['max_attempts'] ?? 0 }}" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Waktu Mulai</label>
                    <input type="datetime-local" name="start_time" class="form-input" value="{{ isset($cfg['start_time']) ? date('Y-m-d\TH:i', strtotime($cfg['start_time'])) : '' }}">
                </div>
                <div class="form-group">
                    <label class="form-label">Waktu Selesai</label>
                    <input type="datetime-local" name="end_time" class="form-input" value="{{ isset($cfg['end_time']) ? date('Y-m-d\TH:i', strtotime($cfg['end_time'])) : '' }}">
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:16px;margin-top:8px">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--text)">
                    <input type="checkbox" name="is_running" value="1" {{ ($cfg['is_running'] ?? '0') === '1' ? 'checked' : '' }} style="width:16px;height:16px;accent-color:var(--green)">
                    CTF Sedang Berjalan
                </label>
                <button type="submit" class="btn btn-primary btn-sm">
                    <i class="ti ti-device-floppy"></i> Simpan Config
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
