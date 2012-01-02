#  Project: Pieces
#  Description: A simple script to split some images and do special effects
#  between it on a list
#  Author: Halan Pinheiro
#  License: MIT

``
(($, window, document) ->
  pluginName = 'pieces'
  defaults =
    pieces:   5
    interval: 500
    duration: 1000

  class Plugin
    constructor: (@element, options) ->
      @options    = $.extend {}, defaults, options
      @_defaults  = defaults
      @_name      = pluginName
      @$el        = $ @element

      @init options

    init: (options)->
      if not @$el.filter('ul').length < 1
        if options is 'next' or options is 'prev'
          @plugin  = @$el.data("plugin_#{@_name}")
          @height   = @plugin.height
          @width    = @plugin.width
          @prev_or_next options
        else
          @_prepare()
      else if @$el.filter('li').length > 0 and @$el.parent().data("plugin_#{@_name}")
        @plugin  = @$el.parent().data("plugin_#{@_name}")
        @height   = @plugin.height
        @width    = @plugin.width
        @move_me @$el, options

    _prepare: ->
      @images = @$el.find 'img'
      @images.filter(':first').load =>
        @height   = @images.height()
        @width    = @images.width()
        @$el.css
          height:   @height
          overflow: 'hidden'
          display:  'block'
          position: 'relative'
        .find('li').css
          display:  'block'
          position: 'absolute'
          top:      0
        @_split_all()
        @start()
      @images.hide()

    _split_all: ->
      for li in @$el.find('li')
        $li       = $ li
        $image    = $li.find('img:first')
        image_src = $image.attr('src')
        pieces    = @options.pieces
        $pieces   = $('<div class="pieces"></div>').appendTo($li)
        $li.data('piece-image-bg', image_src)
        for i in [1..pieces]
          $piece     = $('<div class="piece"></div>').appendTo($pieces)
          piece_w   = @width/pieces
          piece_h   = @height
          bg_x_pos  = (i-1)*piece_w
          
          $piece.data('bg_x_pos', bg_x_pos)
          $piece.css
            backgroundImage:    "url(#{image_src})"
            backgroundRepeat:   'no-repeat'
            backgroundPosition: "-#{bg_x_pos}px -#{piece_h}px"
            opacity:            0
            height:             piece_h
            width:              piece_w
            float:              'left'

    start: ->
      @show_me @$el.find('li:first'), 'show'

    prev: -> @prev_or_next('prev')

    next: -> @prev_or_next('next')

    prev_or_next: (direction)->
      filter =
        next: 'first'
        prev: 'last'
      $target = @$el.find('.current')[direction]()
      $target = @$el.find('li:'+filter[direction]) if $target.length < 1
      @show_me $target

    show_me: ($li) ->
      $li = $ $li
      return if $($li).filter('li').length is not 1
      
      $old_current = $li.parent().find('.current')

      $old_current.removeClass('current').css 'z-index', 9
      $li.addClass('current').css 'z-index', 10

      @move_me $old_current, 'top' if $old_current.length > 0
      @move_me $li, 'show'

    move_me: ($li, action) ->
      $li = $ $li
      return if $($li).filter('li').length is not 1

      $ul           = $li.parent()
      delay         = 0
      $pieces       = $li.find('.pieces .piece')

      $ul.trigger 'start-animation'
      $pieces.filter(':last').bind 'end-piece-animation', ->
        $ul.trigger 'end-animation'
      
      for piece in $pieces
        do =>
          delay     += @options.interval
          $piece    = $ piece
          duration  = @options.duration
          bg_y_pos  = @y_coord action
          opacity   = if action is 'show' then 1 else 0

          setTimeout ->
            $piece.trigger 'start-piece-animation'
            $piece.stop().animate
              backgroundPositionY: bg_y_pos+'px'
              opacity: opacity
            , duration, ->
              $piece.trigger 'end-piece-animation'
          , delay
    
    y_coord: (action)->
      (
        show:   0
        top:    -@height
        bottom: @height
      )[action]

  $.fn[pluginName] = (options) ->
    @each -> $.data(@, "plugin_#{pluginName}", new Plugin(@, options))
)(jQuery, window, document)
