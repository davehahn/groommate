class CommentsController < ApplicationController


def new
  @commentable = find_commentable  

  respond_to do |format|
    format.html
    format.js
  end
end

def create
  @commentable = find_commentable
  @comment = @commentable.comments.build(params[:comment])

  respond_to do |format|
    if @comment.save
      format.html
      format.js
    else
      @commentable.reload
      format.html
      format.js
    end
  end
end


private

def find_commentable
  params.each do |name, value|
    if name =~ /(.+)_id$/
      return $1.classify.constantize.find(value)
    end
  end
  nil
end

end
