#  Project: Pieces
#  Description: A simple script to split some images and do special effects
#  between it on a list
#  Author: Halan Pinheiro
#  License: MIT

``
(($, window, document) ->
  pluginName = 'pieces'
  defaults =
    property: 'value'

  class Plugin
    constructor: (@element, options) ->
      @options = $.extend {}, defaults, options

      @_defaults = defaults
      @_name = pluginName

      @init()

    init: ->

  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(this, "plugin_#{pluginName}")
        $.data(@, "plugin_#{pluginName}", new Plugin(@, options))
)(jQuery, window, document)
