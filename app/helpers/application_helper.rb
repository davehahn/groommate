module ApplicationHelper

  def sortable(column, title = nil)
    title ||= column.titleize
    css_class = (column == sort_column[0]) ? "current #{sort_direction}" : nil
    direction = (sort_direction == "asc") ? "desc" : "asc"
    link_to title, params.merge(:sort => column, :direction => direction, :page => nil, :current_page => nil),{:class => "#{css_class} ajaxLink"}
  end
  
end
