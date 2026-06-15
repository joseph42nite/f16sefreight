<?php

namespace App\Events;

use App\EmailThread;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmailClassified implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var \App\EmailThread
     */
    public $thread;

    /**
     * @var string
     */
    public $classification;

    /**
     * Create a new event instance.
     *
     * @param  \App\EmailThread  $thread
     * @param  string  $classification
     * @return void
     */
    public function __construct(EmailThread $thread, string $classification)
    {
        $this->thread = $thread;
        $this->classification = $classification;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('mailbox-channel');
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'email.classified';
    }
}
